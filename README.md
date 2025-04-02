# Mainstack Frontend Assessment

A modern transaction management dashboard built as part of a frontend role assessment at Mainstack. This application demonstrates the implementation of a clean, efficient, and user-friendly interface for managing and filtering financial transactions.

## Features

- 📊 Transaction dashboard with real-time data
- 🔍 Advanced filtering capabilities
  - Date range selection
  - Transaction type filtering
  - Transaction status filtering
- 📱 Responsive design for all screen sizes
- 🎨 Modern and clean UI with smooth animations
- ⚡ Fast and efficient data fetching with caching

## Tech Stack

### Core Technologies

- **Next.js 14** - React framework for production

  - App Router for better performance and SEO
  - Server Components for improved initial page load
  - Built-in API routes for backend functionality

- **TypeScript** - For type safety and better developer experience
  - Ensures code reliability and maintainability
  - Provides better IDE support and autocompletion

### State Management

- **Zustand** - Lightweight state management solution
  - Simple and intuitive API
  - Minimal boilerplate compared to Redux
  - Perfect for managing global application state
  - Built-in TypeScript support

### Data Fetching

- **TanStack Query (React Query)** - Data fetching and caching
  - Automatic background data updates
  - Built-in caching and invalidation
  - Optimistic updates
  - Error handling and retry logic

### Styling

- **Tailwind CSS** - Utility-first CSS framework

  - Rapid UI development
  - Consistent design system
  - Zero-runtime CSS
  - Highly customizable

- **shadcn/ui** - Re-usable components built with Radix UI
  - Accessible by default
  - Customizable and themeable
  - Built on top of Tailwind CSS
  - Copy-paste components for faster development

## Why These Technologies?

### Next.js

- Provides an excellent developer experience
- Offers built-in performance optimizations
- Enables server-side rendering and static site generation
- Great for SEO and initial page load performance

### TypeScript

- Adds type safety to JavaScript
- Helps catch errors during development
- Improves code maintainability
- Better IDE support and developer experience

### Zustand

- Simpler alternative to Redux
- Less boilerplate code
- Easy to understand and implement
- Perfect for small to medium-sized applications

### TanStack Query

- Handles complex data fetching scenarios
- Provides automatic caching and background updates
- Reduces boilerplate for data fetching logic
- Great developer experience with built-in devtools

### Tailwind CSS

- Speeds up UI development
- Ensures consistent styling
- Reduces CSS bundle size
- Highly customizable and maintainable

### shadcn/ui

- Provides accessible components out of the box
- Built on top of Radix UI for accessibility
- Easy to customize and theme
- Reduces development time with pre-built components

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   ├── filter/          # Filter-related components
│   └── ui/              # Reusable UI components
├── lib/                  # Utility functions and API calls
├── store/               # Zustand store
└── public/              # Static assets
```

## Development Approach

This project was built with a focus on:

- Clean and maintainable code
- Type safety
- Performance optimization
- User experience
- Developer experience (except Nextjs though 😅)

The combination of these technologies allows for rapid development while maintaining high standards of code quality and user experience.

## Improvements

This are some of the improvements i would have made to my projects if i wasnt contrained on time.

### Component Architecture

- **Custom Icon Components**

  - Create a dedicated `components/icons` directory
  - Implement reusable icon components using figma assets
  - Add proper TypeScript types and props
  - Example using lucide icons:

    ```tsx
    // components/icons/index.tsx
    import { LucideIcon } from 'lucide-react';

    interface IconProps {
      icon: LucideIcon;
      size?: number;
      className?: string;
    }

    export function Icon({ icon: Icon, size = 24, className }: IconProps) {
      return <Icon size={size} className={className} />;
    }
    ```

### Code Organization

- **Component Breakdown**
  - Split large components into smaller, focused components
  - Create separate files for types and constants
  - Example structure:
    ```
    components/
    ├── dashboard/
    │   ├── transaction-list/
    │   │   ├── index.tsx
    │   │   ├── transaction-card.tsx
    │   │   ├── transaction-item.tsx
    │   │   ├── types.ts
    │   │   └── constants.ts
    │   └── filter/
    │       ├── index.tsx
    │       ├── date-range-picker.tsx
    │       ├── transaction-type-filter.tsx
    │       ├── transaction-status-filter.tsx
    │       ├── types.ts
    │       └── constants.ts
    ```

### Performance Optimizations

- **Memoization**

  - Use `useMemo` for expensive computations
  - Implement `useCallback` for event handlers
  - Add `React.memo` for pure components

- **Code Splitting**
  - Implement dynamic imports for large components
  - Use Next.js dynamic imports for route-based code splitting
  - Lazy load components that are not immediately needed

### Type Safety

- **Shared Types**
  - Create a dedicated `types` directory
  - Use Zod for runtime type validation

### Accessibility

- **ARIA Labels**
  - Add proper ARIA labels to interactive elements
  - Implement keyboard navigation for the Navbar
  - Ensure proper color contrast

### State Management

- **Store Organization**
  - Split Zustand stores by feature
  - Implement proper TypeScript types for store actions
  - Add middleware for logging and persistence

### Error Handling

- **Error Boundaries**
  - Implement React Error Boundaries
  - Add proper error states for components
  - Create reusable error components

### Documentation

- **Component Documentation**
  - Add JSDoc comments for complex functions
  - Document prop types and usage examples

These improvements would enhance the codebase's maintainability, performance, and developer experience while following React and TypeScript best practices.
