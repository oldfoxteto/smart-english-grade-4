// Code Quality and Refactoring Utilities
import { ComponentType, ReactNode, useMemo, useCallback } from 'react';

// Higher-Order Component for Error Handling
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
): ComponentType<P> {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Higher-Order Component for Loading States
export function withLoadingState<P extends { loading?: boolean }>(
  Component: ComponentType<P>,
  LoadingComponent: ComponentType
): ComponentType<P> {
  return function WrappedComponent(props: P) {
    if (props.loading) {
      return <LoadingComponent />;
    }
    return <Component {...props} />;
  };
}

// Higher-Order Component for Performance Monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  componentName: string
): ComponentType<P> {
  return function WrappedComponent(props: P) {
    const startTime = performance.now();
    
    // Component will be wrapped with performance monitoring
    return <Component {...props} />;
  };
}

// Generic Component Factory
export function createComponent<T extends Record<string, any>>(
  config: {
    displayName: string;
    defaultProps?: Partial<T>;
    validate?: (props: T) => string | null;
    transform?: (props: T) => T;
  }
) {
  return function Component(props: T) {
    // Validate props
    if (config.validate) {
      const error = config.validate(props);
      if (error) {
        throw new Error(`${config.displayName}: ${error}`);
      }
    }
    
    // Transform props
    const transformedProps = config.transform 
      ? config.transform(props) 
      : props;
    
    // Apply default props
    const finalProps = { ...config.defaultProps, ...transformedProps };
    
    return <div>{JSON.stringify(finalProps)}</div>;
  };
}

// Smart Component Wrapper
export function createSmartComponent<P extends object>(
  Component: ComponentType<P>,
  options: {
    memo?: boolean;
    errorBoundary?: boolean;
    loadingState?: boolean;
    performance?: boolean;
  } = {}
): ComponentType<P> {
  let WrappedComponent = Component;
  
  // Add memoization
  if (options.memo) {
    WrappedComponent = React.memo(WrappedComponent);
  }
  
  // Add error boundary
  if (options.errorBoundary) {
    WrappedComponent = withErrorBoundary(WrappedComponent);
  }
  
  // Add loading state
  if (options.loadingState) {
    WrappedComponent = withLoadingState(WrappedComponent, () => <div>Loading...</div>);
  }
  
  // Add performance monitoring
  if (options.performance) {
    WrappedComponent = withPerformanceMonitoring(WrappedComponent, Component.name);
  }
  
  return WrappedComponent;
}

// Code Quality Metrics
export interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  duplicateCode: number;
  technicalDebt: number;
}

export class CodeQualityAnalyzer {
  static analyzeComponent(component: string): CodeQualityMetrics {
    return {
      complexity: this.calculateComplexity(component),
      maintainability: this.calculateMaintainability(component),
      testCoverage: this.estimateTestCoverage(component),
      duplicateCode: this.detectDuplicates(component),
      technicalDebt: this.calculateTechnicalDebt(component)
    };
  }
  
  private static calculateComplexity(code: string): number {
    // Simplified complexity calculation
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', 'try'];
    let complexity = 1; // Base complexity
    
    complexityKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      complexity += matches ? matches.length : 0;
    });
    
    return complexity;
  }
  
  private static calculateMaintainability(code: string): number {
    const lines = code.split('\n').length;
    const functions = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;
    const comments = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
    
    // Maintainability index (simplified)
    const maintainability = Math.max(0, 100 - (lines / 10) + (functions * 5) + (comments * 2));
    return Math.min(100, maintainability);
  }
  
  private static estimateTestCoverage(code: string): number {
    // Estimate based on test-related patterns
    const testPatterns = ['describe', 'it', 'test', 'expect', 'should'];
    let coverage = 0;
    
    testPatterns.forEach(pattern => {
      if (code.includes(pattern)) {
        coverage += 20;
      }
    });
    
    return Math.min(100, coverage);
  }
  
  private static detectDuplicates(code: string): number {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const uniqueLines = new Set(lines);
    const duplicates = lines.length - uniqueLines.size;
    return (duplicates / lines.length) * 100;
  }
  
  private static calculateTechnicalDebt(code: string): number {
    let debt = 0;
    
    // Check for code smells
    if (code.includes('console.log')) debt += 5;
    if (code.includes('any')) debt += 10;
    if (code.length > 500) debt += 5;
    if (code.includes('TODO') || code.includes('FIXME')) debt += 10;
    
    return debt;
  }
}

// Refactoring Utilities
export class RefactoringUtils {
  static extractComponent(
    code: string,
    componentName: string,
    props: string[]
  ): string {
    const extractedCode = `
interface ${componentName}Props {
  ${props.map(prop => `${prop}: any;`).join('\n  ')}
}

const ${componentName}: React.FC<${componentName}Props> = (${props.join(', ')}) => {
  ${code}
};

export default ${componentName};
    `;
    
    return extractedCode;
  }
  
  static extractHook(
    code: string,
    hookName: string,
    dependencies: string[]
  ): string {
    const extractedCode = `
import { useState, useEffect, useCallback } from 'react';

const ${hookName} = () => {
  ${code}
  
  return {
    // Return values here
  };
};

export default ${hookName};
    `;
    
    return extractedCode;
  }
  
  static optimizeImports(code: string): string {
    // Remove unused imports
    const imports = code.match(/import.*?from.*?;/g) || [];
    const usedImports = imports.filter(imp => {
      const importName = imp.match(/import\s*{([^}]+)}/)?.[1];
      if (!importName) return true;
      
      return importName.split(',').some(name => 
        code.includes(name.trim())
      );
    });
    
    return usedImports.join('\n') + '\n' + code.replace(/import.*?from.*?;/g, '');
  }
  
  static simplifyConditionalLogic(code: string): string {
    // Simplify nested conditionals
    return code
      .replace(/if\s*\(([^)]+)\)\s*{\s*if\s*\(([^)]+)\)\s*{/g, 'if ($1 && $2) {')
      .replace(/if\s*\(([^)]+)\)\s*{\s*return\s*([^;]+);\s*}\s*else\s*{\s*return\s*([^;]+);\s*}/g, 'return $1 ? $2 : $3;');
  }
  
  static extractConstants(code: string): string {
    const constants: string[] = [];
    
    // Find string literals that could be constants
    const stringLiterals = code.match(/["']([^"']+)["']/g) || [];
    const uniqueStrings = new Set(stringLiterals);
    
    uniqueStrings.forEach((str, index) => {
      if (str.length > 10 && !str.includes('http')) {
        const constantName = `CONSTANT_${index}`;
        constants.push(`const ${constantName} = ${str};`);
        code = code.replace(new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), constantName);
      }
    });
    
    return constants.join('\n') + '\n' + code;
  }
}

// Code Documentation Generator
export class DocumentationGenerator {
  static generateComponentDocs(componentName: string, props: any[]): string {
    return `
# ${componentName}

## Description
${this.generateDescription(componentName)}

## Props
${props.map(prop => this.generatePropDoc(prop)).join('\n')}

## Examples
\`\`\`tsx
<${componentName} ${props.map(p => `${p.name}={${p.default}}`).join(' ')} />
\`\`\`

## Notes
${this.generateNotes(componentName)}
    `;
  }
  
  private static generateDescription(componentName: string): string {
    return `The ${componentName} component is used for...`;
  }
  
  private static generatePropDoc(prop: any): string {
    return `
### ${prop.name}
- **Type**: \`${prop.type}\`
- **Required**: ${prop.required ? 'Yes' : 'No'}
- **Default**: \`${prop.default || 'undefined'}\`
- **Description**: ${prop.description || 'No description available.'}
    `;
  }
  
  private static generateNotes(componentName: string): string {
    return `Additional notes about ${componentName} usage and best practices.`;
  }
  
  static generateHookDocs(hookName: string, params: any[], returns: any[]): string {
    return `
# ${hookName}

## Description
${this.generateHookDescription(hookName)}

## Parameters
${params.map(param => this.generateParamDoc(param)).join('\n')}

## Returns
${returns.map(ret => this.generateReturnDoc(ret)).join('\n')}

## Examples
\`\`\`tsx
const ${hookName.toLowerCase()} = ${hookName}();
\`\`\`

## Notes
${this.generateHookNotes(hookName)}
    `;
  }
  
  private static generateHookDescription(hookName: string): string {
    return `The ${hookName} hook is used for...`;
  }
  
  private static generateParamDoc(param: any): string {
    return `- **${param.name}**: ${param.type} - ${param.description}`;
  }
  
  private static generateReturnDoc(ret: any): string {
    return `- **${ret.name}**: ${ret.type} - ${ret.description}`;
  }
  
  private static generateHookNotes(hookName: string): string {
    return `Additional notes about ${hookName} usage and best practices.`;
  }
}

// Code Review Checklist
export interface CodeReviewChecklist {
  naming: boolean;
  structure: boolean;
  performance: boolean;
  security: boolean;
  testing: boolean;
  documentation: boolean;
  accessibility: boolean;
  errorHandling: boolean;
  typescript: boolean;
  bestPractices: boolean;
}

export class CodeReviewHelper {
  static generateChecklist(): CodeReviewChecklist {
    return {
      naming: true,
      structure: true,
      performance: true,
      security: true,
      testing: true,
      documentation: true,
      accessibility: true,
      errorHandling: true,
      typescript: true,
      bestPractices: true
    };
  }
  
  static reviewCode(code: string, checklist: CodeReviewChecklist): {
    issues: string[];
    suggestions: string[];
    score: number;
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;
    
    if (checklist.naming) {
      if (!/^[A-Z][a-zA-Z]*$/.test(code)) {
        issues.push('Component names should follow PascalCase');
        score -= 5;
      }
    }
    
    if (checklist.structure) {
      if (code.length > 500) {
        suggestions.push('Consider breaking down large components');
        score -= 3;
      }
    }
    
    if (checklist.performance) {
      if (code.includes('useState') && !code.includes('useMemo')) {
        suggestions.push('Consider using useMemo for performance optimization');
        score -= 2;
      }
    }
    
    if (checklist.typescript) {
      if (code.includes('any')) {
        issues.push('Avoid using "any" type');
        score -= 10;
      }
    }
    
    return { issues, suggestions, score: Math.max(0, score) };
  }
}
