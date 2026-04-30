Here's the detailed implementation plan with checklists for every task:

## 📋 DETAILED IMPLEMENTATION PLAN WITH CHECKLISTS

### 1. ✅ Create SupportButton Component
**Location:** `src/ui/Header/SupportButton.tsx`

**Checklist:**
- [ ] Create file following exact template structure
- [ ] Import order: React → MUI → OIDC → Types → Components
- [ ] Use DownloadIcon from @mui/icons-material/Download.tsx
- [ ] Implement proper TypeScript interface
- [ ] Use sx prop for styling (no inline styles)
- [ ] Add accessibility attributes
- [ ] Named export (not default)
- [ ] Follow Material-UI component patterns
- [ ] Add onClick handler calling downloadSupportFile()
- [ ] Use D.downloadSupportFile for i18n label

**Code Structure:**
```typescript
// Import order 1-5
import React from 'react';
import { Button, Paper, Stack } from '@mui/material';
import { useOidcAccessToken } from '@axafr/oidc';
import type { SupportButtonProps } from '../../types/supportTypes.ts';
import { downloadSupportFile } from '../../utils/support.ts';
import { Row } from '../Row.tsx';
import { Typography } from '../Typography.tsx';
import DownloadIcon from '@mui/icons-material/Download.tsx';
```

### 2. ✅ Add i18n Translations
**Location:** `src/i18n/navigationMessage.ts`

**Checklist:**
- [ ] Add translation object to existing dictionary
- [ ] English: "support file"
- [ ] French: "fichier d'assistance"
- [ ] Albanian: "file mbështetje"
- [ ] Follow existing translation pattern
- [ ] Ensure proper comma placement
- [ ] Verify no syntax errors

**Implementation:**
```typescript
downloadSupportFile: {
  fr: 'fichier d\'assistance',
  en: 'support file',
  sq: 'file mbështetje'
}
```

### 3. ✅ Update Global Type Definitions
**Location:** `src/global.d.ts`

**Checklist:**
- [ ] Extend existing DramaQueen module declaration
- [ ] Add getQueenVersion function type
- [ ] Ensure proper TypeScript syntax
- [ ] No conflicting declarations
- [ ] Follow existing pattern

**Implementation:**
```typescript
declare module 'dramaQueen/DramaIndex' {
  export function mount(configuration: {
    mountPoint: HTMLElement | null;
    initialPathname: string;
  }): VoidFunction;

  export function getQueenVersion(): string;
}
```

### 4. ✅ Create Support Data Types
**Location:** `src/types/supportTypes.ts`

**Checklist:**
- [ ] Create SupportData interface
- [ ] Create SupportButtonProps interface
- [ ] Proper TypeScript typing
- [ ] Export types correctly
- [ ] Follow existing type patterns
- [ ] No circular dependencies

**Implementation:**
```typescript
export interface SupportData {
  currentUrl: string;
  appVersion: string;
  queenVersion: string;
  navigatorInfo: string;
  lastSyncDate: string;
}

export interface SupportButtonProps {
  disabled?: boolean;
}
```

### 5. ✅ Create Support Utility Functions
**Location:** `src/utils/support.ts`

**Checklist:**
- [ ] Import required dependencies with extensions
- [ ] Create getQueenVersionSafely() with try/catch
- [ ] Create getSupportData() pure function
- [ ] Create generateSupportFileContent() pure function
- [ ] Create downloadSupportFile() side effect function
- [ ] Use proper error handling
- [ ] Follow immutable patterns
- [ ] Proper TypeScript typing
- [ ] No console.log or side effects in pure functions

**Implementation:**
```typescript
import { format } from 'date-fns';
import { version } from '../package.json';

const DEFAULT_QUEEN_VERSION = 'error when getting queen version';
const DEFAULT_SYNC_DATE = 'no synch yet';

// Pure functions with proper error handling
```

### 6. ✅ Update Synchronization Logic
**Location:** `src/utils/synchronize/check.ts`

**Checklist:**
- [ ] Import format from date-fns
- [ ] Find success state in analyseResult()
- [ ] Add localStorage setItem for success case
- [ ] Use proper date formatting
- [ ] No side effects on error cases
- [ ] Maintain existing function signature
- [ ] Preserve all existing logic

**Implementation:**
```typescript
if (result.state === 'success') {
  const humanReadableDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
  localStorage.setItem('LAST_SYNCH_SUCCESS_DATE', humanReadableDate);
}
```

### 7. ✅ Create Initialization Utility
**Location:** `src/utils/initialize.ts`

**Checklist:**
- [ ] Create initializeSyncDate() function
- [ ] Check localStorage for existing value
- [ ] Set default if missing
- [ ] No side effects on existing values
- [ ] Proper error handling
- [ ] Export function correctly

**Implementation:**
```typescript
export function initializeSyncDate(): void {
  if (!localStorage.getItem('LAST_SYNCH_SUCCESS_DATE')) {
    localStorage.setItem('LAST_SYNCH_SUCCESS_DATE', 'no synch yet');
  }
}
```

### 8. ✅ Update Header Component
**Location:** `src/ui/Header.tsx`

**Checklist:**
- [ ] Import SupportButton with .tsx extension
- [ ] Add SupportButton to header navigation
- [ ] Position appropriately in row
- [ ] Maintain existing component structure
- [ ] No style changes to existing components
- [ ] Proper import order

**Implementation:**
```typescript
import { SupportButton } from './Header/SupportButton.tsx';

// Add to navigation row:
<SupportButton />
```

### 9. ✅ Add App Initialization
**Location:** `src/App.tsx`

**Checklist:**
- [ ] Import initializeSyncDate with .ts extension
- [ ] Add useEffect for initialization
- [ ] Run once on app mount
- [ ] No dependencies array
- [ ] Error handling
- [ ] Preserve existing initialization logic

**Implementation:**
```typescript
useEffect(() => {
  initializeSyncDate();
}, []);
```

### 10. ✅ Testing and Validation
**Checklist:**
- [ ] Verify no inline styles
- [ ] Verify all imports have extensions
- [ ] Verify all if statements have blocks
- [ ] Verify no MUI base style overrides
- [ ] Verify proper TypeScript compilation
- [ ] Test download functionality
- [ ] Test error cases (missing queen version)
- [ ] Test sync date persistence
- [ ] Test i18n translations
- [ ] Verify accessibility compliance
- [ ] Run pnpm run build (must succeed)

## 🔧 IMPLEMENTATION ORDER:
1. Type definitions (supportTypes.ts)
2. i18n translations (navigationMessage.ts)
3. Global types (global.d.ts)
4. Support utility (support.ts)
5. Initialization utility (initialize.ts)
6. SupportButton component (SupportButton.tsx)
7. Synchronization update (check.ts)
8. Header update (Header.tsx)
9. App initialization (App.tsx)
10. Testing and validation

## 📁 FILES TO BE CREATED/MODIFIED:
```
src/
├── types/
│   └── supportTypes.ts          # NEW
├── utils/
│   ├── support.ts               # NEW
│   ├── initialize.ts            # NEW
│   └── synchronize/
│       └── check.ts             # MODIFIED
├── i18n/
│   └── navigationMessage.ts     # MODIFIED
├── ui/
│   └── Header/
│       ├── SupportButton.tsx     # NEW
│       └── Header.tsx            # MODIFIED
├── global.d.ts                   # MODIFIED
└── App.tsx                      # MODIFIED
```

This comprehensive checklist ensures full crafts compliance and covers all requirements from the specification.