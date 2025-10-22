# @elevanaltd/ui

React UI components for EAV Operations Suite.

## Installation

```bash
npm install @elevanaltd/ui @elevanaltd/shared-lib
```

## Usage

```tsx
import { NavigationProvider } from '@elevanaltd/shared-lib';
import { HierarchicalNavigationSidebar } from '@elevanaltd/ui';

function App() {
  return (
    <NavigationProvider>
      <HierarchicalNavigationSidebar
        projects={projects}
        videos={videos}
        loading={loading}
        onProjectExpand={handleExpand}
      />
    </NavigationProvider>
  );
}
```

## Development

```bash
npm run dev          # Watch mode
npm run build        # Production build
npm run test         # Run tests
npm run validate     # Lint + typecheck + test
```
