# Production Deployment Script
#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DOCKER_REGISTRY="ghcr.io"
IMAGE_NAME="smart-english-grade-4"
NAMESPACE="production"
HEALTH_CHECK_URL="https://smart-english-grade-4.com/health"
BACKUP_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
ROLLBACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

send_notification() {
    local message="$1"
    local webhook_url="$2"
    
    if [ -n "$webhook_url" ]; then
        curl -X POST -H 'Content-Type: application/json' \
             -d "{\"text\":\"$message\"}" \
             "$webhook_url" || log_error "Failed to send notification"
    fi
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Check if Docker registry is accessible
    if ! docker info &> /dev/null; then
        log_error "Cannot connect to Docker registry. Please check your Docker configuration."
        exit 1
    fi
    
    log_info "Prerequisites check completed!"
}

build_image() {
    log_info "Building Docker image..."
    
    # Build the Docker image
    docker build \
        --tag "${DOCKER_REGISTRY}/${IMAGE_NAME}:latest" \
        --tag "${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER:-latest}" \
        --build-arg BUILD_NUMBER="${BUILD_NUMBER:-$(date +%Y%m%d%H%M%S)}" \
        .
    
    log_info "Docker image built successfully!"
}

push_image() {
    log_info "Pushing Docker image to registry..."
    
    # Push the image
    docker push "${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
    docker push "${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER:-latest}"
    
    log_info "Docker image pushed successfully!"
}

deploy_to_kubernetes() {
    log_info "Deploying to Kubernetes cluster..."
    
    # Apply Kubernetes configurations
    kubectl apply -f k8s/frontend-deployment.yaml
    kubectl apply -f k8s/monitoring.yaml
    
    # Wait for deployment to be ready
    log_info "Waiting for deployment to be ready..."
    kubectl rollout status deployment/smart-english-frontend -n $NAMESPACE
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=smart-english -n $NAMESPACE --timeout=300s
    
    log_info "Deployment completed successfully!"
}

health_check() {
    log_info "Performing health check..."
    
    # Wait for the application to be ready
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            log_info "Health check passed!"
            return 0
        fi
        
        log_warning "Health check attempt $attempt failed. Retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts!"
    return 1
}

rollback_deployment() {
    log_warning "Rolling back to previous version..."
    
    # Get the previous image tag
    local previous_image=$(kubectl get deployment smart-english-frontend -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}' | tr -d '"')
    
    if [ -z "$previous_image" ]; then
        log_error "No previous image found for rollback!"
        return 1
    fi
    
    log_info "Rolling back to: $previous_image"
    
    # Update deployment to use previous image
    kubectl set image deployment/smart-english-frontend -n $NAMESPACE smart-english-frontend="$previous_image"
    
    # Wait for rollback to complete
    kubectl rollout status deployment/smart-english-frontend -n $NAMESPACE
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=smart-english -n $NAMESPACE --timeout=300s
    
    log_info "Rollback completed successfully!"
    send_notification "🔄 Rollback completed! Previous image: $previous_image" "$ROLLBACK_WEBHOOK_URL"
}

backup_database() {
    log_info "Creating database backup..."
    
    # Create database backup
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    mysqldump \
        --single-transaction \
        --routines \
        --triggers \
        --all-databases \
        --add-drop-database \
        --add-locks \
        --disable-keys \
        --extended-insert \
        --quick \
        --lock-tables=false \
        --set-gtid-purged=OFF \
        -h $DB_HOST \
        -u $DB_USER \
        -p$DB_PASSWORD \
        $DB_NAME > "$backup_file"
    
    # Compress backup
    gzip "$backup_file"
    
    # Upload to S3
    local s3_path="backups/$(date +%Y/%m/%d)/"
    aws s3 cp "$backup_file.gz" "s3://$S3_BUCKET/$s3_path" --storage-class STANDARD_IA
    
    log_info "Database backup completed: $backup_file.gz"
    send_notification "🗄️ Database backup completed! Size: $(stat -c%s "$backup_file.gz")" "$BACKUP_WEBHOOK_URL"
}

cleanup_old_backups() {
    log_info "Cleaning up old backups (keeping last 30 days)..."
    
    # List and delete old backups
    aws s3 ls s3://$S3_BUCKET/backups/ --recursive | \
    while read -r line; do
        backup_date=$(echo $line | awk '{print $1}')
        backup_path=$(echo $line | awk '{print $4}')
        
        # Calculate days since backup
        backup_timestamp=$(date -d "$backup_date" +%s 2>/dev/null || echo 0)
        current_timestamp=$(date +%s)
        days_old=$(( (current_timestamp - backup_timestamp) / 86400 ))
        
        if [ $days_old -gt 30 ]; then
            echo "Deleting old backup: $backup_path ($days_old days old)"
            aws s3 rm "s3://$S3_BUCKET/$backup_path"
        fi
    done
    
    log_info "Old backup cleanup completed!"
}

main() {
    local command=${1:-deploy}
    local BUILD_NUMBER=${2:-$(date +%Y%m%d%H%M%S)}
    
    case $command in
        "build")
            check_prerequisites
            build_image
            ;;
        "push")
            check_prerequisites
            push_image
            ;;
        "deploy")
            check_prerequisites
            deploy_to_kubernetes
            health_check
            send_notification "🚀 Deployment completed successfully! Image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}" "$WEBHOOK_URL"
            ;;
        "rollback")
            check_prerequisites
            rollback_deployment
            ;;
        "backup")
            backup_database
            cleanup_old_backups
            ;;
        "health")
            health_check
            ;;
        "all")
            check_prerequisites
            build_image
            push_image
            deploy_to_kubernetes
            health_check
            send_notification "🎉 Full deployment completed! Image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}" "$WEBHOOK_URL"
            ;;
        *)
            echo "Usage: $0 {build|push|deploy|rollback|backup|health|all} [BUILD_NUMBER]"
            echo ""
            echo "Commands:"
            echo "  build     - Build Docker image"
            echo "  push      - Push image to registry"
            echo "  deploy    - Deploy to Kubernetes"
            echo "  rollback  - Rollback to previous version"
            echo "  backup    - Create database backup"
            echo "  health    - Perform health check"
            echo "  all       - Run full deployment pipeline"
            echo ""
            echo "Examples:"
            echo "  $0 deploy 20240101_120000"
            echo "  $0 rollback"
            echo "  $0 backup"
            echo "  $0 health"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
