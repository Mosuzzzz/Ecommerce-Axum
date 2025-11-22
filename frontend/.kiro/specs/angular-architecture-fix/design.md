# Design Document

## Overview

This design document outlines the approach to fix the Angular application architecture by migrating from a mixed NgModule/standalone setup to a pure standalone component architecture. The solution involves removing legacy NgModule files, properly configuring the standalone bootstrap, implementing missing components, and ensuring all dependencies are correctly provided.

## Architecture

### Current State
- Mixed architecture with both `app.module.ts` (NgModule) and `app.ts` (standalone)
- `main.ts` bootstraps using `platformBrowserDynamic().bootstrapModule(AppModule)`
- Standalone components exist but aren't properly integrated
- Missing routing configuration
- Missing HttpClient provider for standalone architecture

### Target State
- Pure standalone component architecture
- `main.ts` bootstraps using `bootstrapApplication(App, appConfig)`
- All components are standalone with proper imports
- Routing configured through `provideRouter` in appConfig
- HttpClient provided through `provideHttpClient` in appConfig
- Complete Home component implementation

## Components and Interfaces

### Application Bootstrap

**File: src/main.ts**
- Remove NgModule bootstrap code
- Use `bootstrapApplication(App, appConfig)` for standalone bootstrap
- Remove environment import (not needed for bootstrap decision)

**File: src/app/app.config.ts**
- Add `provideHttpClient()` to providers array
- Keep existing `provideRouter(routes)`
- Keep `provideBrowserGlobalErrorListeners()`

### Routing Configuration

**File: src/app/app.routes.ts**
- Define root route ('') mapping to Home component
- Use lazy loading pattern for better performance
- Export routes array for use in appConfig

### Component Structure

**File: src/app/page/home.component.ts**
- Create standalone Home component
- Import Hero and ProductCarousel components
- Use inline template or separate HTML file
- Include component selector 'app-home'

**File: src/app/page/home.component.html**
- Include `<app-hero>` element
- Include `<app-product-carousel>` element
- Wrap in semantic HTML structure

### Files to Remove

**File: src/app/app.module.ts**
- Delete this file entirely
- No longer needed in standalone architecture

## Data Models

### Product Interface
Already defined in ProductService:
```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}
```

No changes needed to the Product interface or ProductService implementation.

## Error Handling

### Build-time Errors
- TypeScript compiler will catch missing imports
- Angular compiler will validate component metadata
- Ensure all templateUrl and styleUrl paths are correct

### Runtime Errors
- HttpClient errors handled by ProductService Observable pattern
- Router navigation errors handled by Angular Router
- Component lifecycle errors caught by Angular error handler (already configured)

### Missing Dependencies
- Verify all component imports are present
- Ensure HttpClient is provided before ProductService injection
- Validate router configuration before navigation

## Testing Strategy

### Build Verification
1. Run `ng build` to verify TypeScript compilation
2. Check for Angular compiler errors
3. Verify bundle generation

### Development Server
1. Run `ng serve` to start dev server
2. Verify server starts without errors
3. Check browser console for runtime errors

### Component Rendering
1. Navigate to root URL
2. Verify navbar renders
3. Verify home component displays hero and product carousel
4. Verify footer renders

### Service Integration
1. Verify ProductService can be injected
2. Check that HttpClient is available
3. Validate API call structure (even if backend not running)

## Implementation Notes

### Import Statements
All standalone components must explicitly import their dependencies:
- Common directives (NgIf, NgFor) from @angular/common
- Router components (RouterOutlet, RouterLink) from @angular/router
- Child components in the imports array

### Component Metadata
Standalone components require:
- `standalone: true` (implicit in Angular 21 with imports array)
- `imports: []` array listing all dependencies
- `selector`, `templateUrl`/`template`, `styleUrl`/`styles`

### Provider Configuration
Application-level providers in appConfig:
- `provideRouter(routes)` - routing functionality
- `provideHttpClient()` - HTTP client for services
- `provideBrowserGlobalErrorListeners()` - error handling

### File Organization
Maintain existing structure:
- Components in `src/app/components/`
- Pages in `src/app/page/`
- Services in `src/app/services/`
- Root app files in `src/app/`
