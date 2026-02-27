# File Structure Suggestion

## 📁 Recommended Project Structure

```
src/
├── components/                    # Reusable UI components
│   ├── ui/                      # Base UI components (atomic)
│   │   ├── index.tsx            # Export all UI components
│   │   ├── AppButton.tsx
│   │   ├── AppCard.tsx
│   │   ├── AppIcon.tsx
│   │   ├── AppProgress.tsx
│   │   ├── AppBadge.tsx
│   │   ├── AppAvatar.tsx
│   │   ├── AppChip.tsx
│   │   ├── AppLayout.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppGrid.tsx
│   │   └── AppPaper.tsx
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── MainDashboard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   ├── lessons/                 # Lesson components
│   ├── assessment/              # Assessment components
│   ├── gamification/            # Gamification components
│   ├── social/                 # Social features
│   ├── notifications/           # Notification system
│   ├── chat/                   # Chat components
│   ├── timer/                  # Timer components
│   └── testing/                # Testing components
├── design-system/               # Design system foundation
│   ├── tokens.ts               # Design tokens
│   ├── theme.ts                # MUI theme configuration
│   └── index.ts               # Export design system
├── hooks/                      # Custom React hooks
├── services/                   # API and business logic
├── utils/                      # Utility functions
├── types/                      # TypeScript type definitions
├── constants/                  # Application constants
├── assets/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── sounds/
├── styles/                     # Global styles
│   ├── globals.css
│   └── components.css
├── pages/                      # Page components
├── layouts/                    # Layout components
├── App.tsx                    # Main App component
└── main.tsx                   # Entry point
```

## 🎯 Design System Architecture

### 1. Tokens (Single Source of Truth)
- `design-system/tokens.ts` - All design decisions
- Colors, spacing, typography, shadows, transitions
- Used by both MUI theme and Tailwind config

### 2. Theme Configuration
- `design-system/theme.ts` - MUI theme setup
- Extends base theme with custom tokens
- Component style overrides

### 3. Reusable Components
- Atomic design principles
- Consistent API across all components
- Built on top of design tokens

### 4. Tailwind Integration
- `tailwind.config.js` - Aligned with design tokens
- Custom utilities for common patterns
- Responsive design utilities

## 🚀 Usage Examples

### Basic Component Usage
```tsx
import { AppCard, AppButton, AppProgress } from '@/components/ui';

const MyComponent = () => {
  return (
    <AppCard title="Progress Card">
      <AppProgress value={75} showLabel />
      <AppButton onClick={handleClick}>Submit</AppButton>
    </AppCard>
  );
};
```

### Using Design Tokens Directly
```tsx
import { tokens } from '@/design-system/tokens';

const CustomComponent = () => {
  return (
    <div style={{
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.md,
      backgroundColor: tokens.colors.primary[50],
    }}>
      Content
    </div>
  );
};
```

### Tailwind Utilities
```tsx
const Component = () => {
  return (
    <div className="p-4 rounded-md bg-primary-50 card-hover">
      <h2 className="text-title font-semibold">Title</h2>
      <p className="text-body text-secondary">Description</p>
    </div>
  );
};
```

## 📱 Responsive Design

### Breakpoint System
- xs: 0px
- sm: 600px
- md: 900px
- lg: 1200px
- xl: 1536px

### Responsive Usage
```tsx
// MUI Grid
<AppGrid container spacing={4}>
  <AppGrid xs={12} sm={6} md={4}>
    Content
  </AppGrid>
</AppGrid>

// Tailwind Classes
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  Content
</div>
```

## 🎨 Color System

### Semantic Colors
- `primary` - Main brand color
- `secondary` - Secondary brand color
- `success` - Success states
- `warning` - Warning states
- `danger` - Error states
- `neutral` - Neutral colors

### Usage
```tsx
// MUI
<AppButton color="primary">Primary Button</AppButton>
<AppButton color="success">Success Button</AppButton>

// Tailwind
<button className="bg-primary-500 text-white">Primary</button>
<button className="bg-success-500 text-white">Success</button>
```

## ♿ Accessibility Features

### Built-in Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

### Usage
```tsx
<AppButton 
  ariaLabel="Submit form"
  onClick={handleSubmit}
>
  Submit
</AppButton>

<div role="status" aria-live="polite">
  Status message
</div>
```

## 🔄 State Management

### Component State
```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await submitData();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Loading States
```tsx
{loading && (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <CircularProgress />
  </Box>
)}
```

### Error Handling
```tsx
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    <AlertTitle>Error</AlertTitle>
    {error}
  </Alert>
)}
```

## 🎯 Best Practices

### 1. Component Design
- Single responsibility principle
- Props interface with TypeScript
- Default values for optional props
- Consistent naming conventions
- Proper error boundaries

### 2. Performance
- React.memo for expensive components
- useCallback for event handlers
- useMemo for expensive calculations
- Lazy loading for heavy components

### 3. Code Organization
- Group related components
- Use barrel exports (index.ts)
- Separate concerns (UI vs logic)
- Consistent import paths

### 4. Testing
- Unit tests for components
- Integration tests for user flows
- Accessibility testing
- Visual regression testing

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Smart English
VITE_ENVIRONMENT=production
```

### Performance Optimization
- Code splitting
- Tree shaking
- Image optimization
- Bundle analysis
- Service worker for PWA
