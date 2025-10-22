# @elevanaltd/ui

React UI components for EAV Operations Suite.

**Architecture:** Two-layer pattern with `@elevanaltd/shared-lib` (logic) and `@elevanaltd/ui` (presentation).

## Status

✅ **PUBLISHED** - v0.1.1 available on GitHub Packages

**Latest Version**: `0.1.1`
**Package Registry**: https://github.com/elevanaltd/eav-ui/pkgs/npm/ui
**Components**: HierarchicalNavigationSidebar

## Installation

```bash
npm install @elevanaltd/ui @elevanaltd/shared-lib
```

**Authentication Required**: Configure GitHub Packages access in `.npmrc`:

```bash
# Project .npmrc or ~/.npmrc
@elevanaltd:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Create a GitHub Personal Access Token with `read:packages` scope at https://github.com/settings/tokens

## Usage

### Basic Integration

```tsx
import { NavigationProvider } from '@elevanaltd/shared-lib';
import { HierarchicalNavigationSidebar } from '@elevanaltd/ui';
import '@elevanaltd/ui/dist/index.css'; // ⚠️ REQUIRED: Import styles

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

**Important:** The CSS import is required for navigation styling to work correctly.

## App-Specific Filtering Pattern

`HierarchicalNavigationSidebar` is a **generic presentation component**. It renders whatever data it receives without applying business rules.

**Apps should filter projects/videos BEFORE passing to the component:**

```tsx
// scripts-web - Filter by script authoring state
function ScriptsNavigationContainer() {
  const { projects, videos, loading } = useNavigationData();

  // APP-SPECIFIC: Show projects needing script work
  const scriptProjects = projects.filter(p =>
    p.script_status !== 'complete'
  );

  return (
    <NavigationProvider>
      <HierarchicalNavigationSidebar
        projects={scriptProjects}  // Pre-filtered data
        videos={videos}
        loading={loading}
        onProjectExpand={handleExpand}
      />
    </NavigationProvider>
  );
}

// vo-web - Filter by VO production state
function VONavigationContainer() {
  const { projects, videos, loading } = useNavigationData();

  // DIFFERENT FILTERING: Show projects needing VO work
  const voProjects = projects.filter(p =>
    p.vo_stream_status !== 'ready'
  );

  return (
    <NavigationProvider>
      <HierarchicalNavigationSidebar
        projects={voProjects}      // Different business logic
        videos={videos}
        loading={loading}
        onProjectExpand={handleExpand}
      />
    </NavigationProvider>
  );
}
```

**Why This Pattern:**
- **Separation of Concerns:** UI package handles presentation, apps handle business logic
- **Reusability:** Same component across 8 apps with different filtering rules
- **Maintainability:** Change UI once, all apps inherit; change filtering per app without coupling

**Examples by App:**
- **scripts-web:** Filter by `script_status !== 'complete'` (show projects needing scripts)
- **vo-web:** Filter by `vo_stream_status !== 'ready'` (show projects needing VO)
- **scenes-web:** Filter by scene planning readiness
- **edit-web:** Filter by edit readiness
- **cam-op-pwa:** Filter by filming schedule
- **data-entry-web:** Filter by metadata completeness

## Development

```bash
npm run dev          # Watch mode
npm run build        # Production build
npm run test         # Run tests
npm run validate     # Lint + typecheck + test
```
