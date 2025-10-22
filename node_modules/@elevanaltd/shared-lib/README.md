<!-- LINK_VALIDATION_BYPASS: Updating documentation with corrected paths -->

# @elevanaltd/shared-lib

Shared Supabase client library for EAV Operations Suite applications.

## Status

✅ **PUBLISHED** - v0.1.5 available on GitHub Packages

**Latest Version**: `0.1.5`
**Package Registry**: https://github.com/elevanaltd/eav-shared-lib/pkgs/npm/shared-lib
**Modules Complete**: Client + Types + Auth + RLS

## Overview

This package provides reusable Supabase patterns extracted from the scripts-web production MVP:
- **Client Module**: Authenticated client factory with configuration management
- **Types Module**: Generated TypeScript types from Supabase schema
- **Auth Module**: Authentication hooks (`useAuth`, `useUser`, `useSession`)
- **RLS Module**: Row-Level Security utilities and query builders

## Installation

```bash
npm install @elevanaltd/shared-lib
```

**Authentication Required**: Configure GitHub Packages access in `.npmrc`:

```bash
# Project .npmrc or ~/.npmrc
@elevanaltd:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Create a GitHub Personal Access Token with `read:packages` scope at https://github.com/settings/tokens

## Usage

### Client Module (Phase 2+)

```typescript
import { createClient } from '@eav-ops/shared-lib/client'

const supabase = createClient({
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY
})
```

### Types Module (Phase 3+)

```typescript
import type { Database, Tables } from '@eav-ops/shared-lib/types'

type Script = Tables<'scripts'>
```

### Auth Module (Phase 4+)

```typescript
import { useAuth } from '@eav-ops/shared-lib/auth'

function MyComponent() {
  const { currentUser, userProfile, signIn, logout } = useAuth()
  // ...
}
```

### RLS Module (Phase 5+)

```typescript
import { applyRLSFilters } from '@eav-ops/shared-lib/rls'

const query = applyRLSFilters(
  supabase.from('scripts').select('*'),
  { userId, role: 'client', clientFilter }
)
```

## Testing

### Overriding Supabase Credentials in Tests

The `createBrowserClient` function supports dependency injection for test environments:

```typescript
// src/test/setup.ts or vitest.config.ts
import { beforeAll } from 'vitest'
import { createBrowserClient } from '@elevanaltd/shared-lib/client'

beforeAll(() => {
  // Override with test credentials
  globalThis.testSupabase = createBrowserClient(
    'https://test-project.supabase.co',
    'test-anon-key'
  )
})
```

**Why This Pattern?**

The shared library is pre-compiled (reads `import.meta.env` at build time). Test environments need to inject mock credentials at runtime. Dependency injection solves this:

```typescript
// Production (no parameters): Uses environment variables
const supabase = createBrowserClient()

// Test (with parameters): Uses injected credentials
const supabase = createBrowserClient(testUrl, testKey)
```

This enables all 7 EAV apps to test with mock Supabase credentials without requiring environment variable manipulation.

## Development

```bash
# Install dependencies
npm install

# Run quality gates
npm run validate

# Run tests
npm test

# Build package
npm run build
```

## Publishing New Versions

**Automated Workflow** (Recommended):

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, or major
   ```

2. Push changes and create git tag:
   ```bash
   git push origin b1_03-phase2
   git push origin v0.1.5  # Tag triggers automatic publication
   ```

3. GitHub Actions automatically:
   - Runs all quality gates (lint + typecheck + format + test)
   - Builds the package
   - Publishes to GitHub Packages
   - Creates release

**Manual Publication** (Emergency Only):

```bash
# Ensure you have a GitHub PAT with write:packages scope
npm run validate  # All gates must pass
npm run build
npm publish
```

**Publication Checklist**:
- [ ] All quality gates passing (`npm run validate`)
- [ ] Version bumped in `package.json`
- [ ] CHANGELOG updated with changes
- [ ] Git tag created (format: `v*.*.*`)
- [ ] Consumers tested with new version

## Quality Standards

- **TDD Discipline**: All features developed test-first (RED→GREEN→REFACTOR)
- **Zero Warnings**: ESLint, TypeScript, and Prettier all pass
- **Strict TypeScript**: No implicit `any` types
- **Integration Tests**: Real Supabase validation (not mocked)

## Architecture

**Phase 1**: ✅ Infrastructure (ESLint, Prettier, Vitest, barrel exports, CI pipeline)
**Phase 2**: ✅ Client Module (Browser client with peerDependencies pattern)
**Phase 3**: ✅ Types Module (Supabase-generated database types)
**Phase 4**: ✅ Auth Module (Framework-agnostic DI-based hooks)
**Phase 5**: ✅ RLS Module (Query builders + InitPlan patterns + test utilities)
**Phase 6**: 🚧 Documentation (README updated, CHANGELOG + API docs remaining)

## License

Private - EAV Operations internal use only

## Contributing

See [B1_03 BUILD.md](../coordination/workflow-docs/001-UNIVERSAL-EAV_SYSTEM-D1-BUILD-REFERENCE.md) for development workflow.
