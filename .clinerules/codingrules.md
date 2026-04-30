# React Coding Rules

# very high priority order:

Tu es un développeur crafts, qui veut de la lisibilité et de la maintenabilité. Le code doit être simple.  
Tu respectes le html sémantique et respecte l'accessibilité selon les critères RGAA et WCAG.  
Tu refuses if inline, after if, code illisible et compliqué, et interdit la duplication.  

Tu dois suivre toutes les étapes de ces règles de codage, sans oublier d'utiliser de bonnes pratiques, et vérifier que le code compilé ne présente aucune erreur dans la console.

## ⚡ 5 RÈGLES NON-NÉGOCIABLES

1. ❌ **JAMAIS inline style** → ✅ Utiliser les composants et props Material-UI
2. ❌ **JAMAIS mutation** → ✅ `[...items, newItem]` `{...user, name: 'new'}`
3. ❌ **JAMAIS imports SANS extension** → ✅ TOUJOURS `.tsx` ou `.ts` (sauf node_modules)
4. ❌ **JAMAIS if inline** → ✅ if avec bloc `{}`
5. ❌ **JAMAIS surcharger les styles de base MUI** → ✅ Utiliser `sx` prop ou `styled()` pour les customisations

## 📋 WORKFLOW (5 ÉTAPES)

### 1. Sélection des composants Material-UI

- Identifier le composant MUI le plus proche des besoins
- Consulter la documentation officielle MUI pour les props disponibles
- Noter les variantes nécessaires (outlined, contained, etc.)
- Définir la structure du composant en utilisant les composants MUI de base

### 2. Créer Fichiers

- `components/{{ComponentName}}/{{ComponentName}}.tsx`
- `types/{{feature}}Types.ts` (si besoin)

### 3. Copy-Paste Template TSX avec Material-UI (voir ci-dessous)

### 4. Checklist (voir fin document)

### 5. Build

```bash
pnpm run build  # DOIT réussir sans erreur
```

## 🏗️ TEMPLATE TSX AVEC MATERIAL-UI

```tsx
// 1. React/hooks → 2. MUI → 3. OIDC → 4. Types (.ts) → 5. Components (.tsx) → 6. Hooks (rien) → 7. Services (rien) → 8. Utils
import React, { useState, useId } from 'react';
import { useOidcAccessToken } from '@axafr/oidc';
import { Button, TextField, Box, Paper } from '@mui/material';
import type { {{ComponentName}}Props } from '../../types/{{feature}}Types.ts';

interface {{ComponentName}}Props {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onAction?: (data: any) => void;
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  variant = 'primary',
  disabled = false,
  onAction
}) => {
  const id = useId();
  const [state, setState] = useState<string>('');
  const { accessToken } = useOidcAccessToken();

  async function handleAction() {
    if (!disabled && accessToken) {
      await apiCall(state, accessToken);
      onAction?.(state);
    }
  }

  return (
    <Paper elevation={variant === 'primary' ? 2 : 1} sx={{ p: 3, width: '100%' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          id={`${id}-input`}
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={disabled}
          label="Input"
          variant="outlined"
          fullWidth
        />
        <Button
          variant={variant === 'primary' ? 'contained' : 'outlined'}
          onClick={handleAction}
          disabled={disabled}
          sx={{ mt: 1 }}
        >
          Save
        </Button>
      </Box>
    </Paper>
  );
};
```

## 🎨 STYLING AVEC MATERIAL-UI

**Règles de customisation MUI :**

1. **Privilégier les props MUI** : Utiliser les props natives des composants (`variant`, `color`, `size`, etc.)
2. **Utiliser `sx` pour les ajustements** : Pour les marges, padding, et layout
3. **Éviter de surcharger le thème** : Ne pas modifier les styles de base des composants
4. **Utiliser `styled()` pour les composants personnalisés** :

```tsx
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomButton = styled(Button)(({ theme }) => ({
  // Customisations spécifiques
  borderRadius: '20px',
  // Utiliser le thème MUI pour la cohérence
  backgroundColor: theme.palette.primary.dark,
}));
```

## ❌→✅ ERREURS FRÉQUENTES

| ❌ INTERDIT                     | ✅ CORRECT                              |
| ------------------------------- | --------------------------------------- |
| `<div id="profile">`            | `<div id={`${id}-profile`}>`            |
| `style={{color: 'red'}}`        | `<Typography color="error">`            |
| `import { Comp } from './Comp'` | `import { Comp } from './Comp.tsx'`     |
| `import { hook } from './hook'` | `import { hook } from './hook.ts'`      |
| `import X from '@shared/X'`     | `import { X } from '@shared/X.tsx'`     |
| `className="custom-style"`      | `sx={{ color: 'primary.main' }}`        |
| `items.push(x)`                 | `[...items, x]`                         |
| `export default Component`      | `export const Component` (named export) |
| `if (x) y = z;`                 | `if (x) { y = z; }`                     |
| `if (x) return y;`              | `if (x) { return y; }`                  |
| `if (x) obj.y = z;`             | `if (x) { obj.y = z; }`                 |

## 📦 IMPORTS ORDRE

1. `import React, { useState } from 'react';`
2. `import { Button, TextField, Box, Paper } from '@mui/material';` (MUI components)
3. `import { useOidcAccessToken } from '@axafr/oidc';`
4. `import type { Props } from '@shared/types/types.ts';` (keyword `type`, AVEC `.ts`)
5. `import { Comp } from '../Comp.tsx';` (relatif AVEC `.tsx`)
6. `import { Comp2 } from '@shared/components/Comp2.tsx';` (path alias AVEC `.tsx`)
7. `import { useHook } from '@shared/hooks/useHook.ts';` (path alias AVEC `.ts`)
8. `import { service } from '@shared/services/service.ts';` (path alias AVEC `.ts`)
9. `import { util } from '@shared/utils/util.ts';` (path alias AVEC `.ts`)

**RÈGLE D'OR:** TOUJOURS inclure `.tsx` ou `.ts` pour vos fichiers. Exception: node_modules (React, MUI, etc.).

## ✅ CHECKLIST FINALE

- [ ] Composant utilise les composants Material-UI appropriés
- [ ] Pas de surcharge des styles de base MUI
- [ ] NO inline `style={{}}` (utiliser props MUI ou `sx`)
- [ ] Imports ordre correct 1-9 avec MUI en position 2
- [ ] États hover/focus/disabled implémentés via props MUI
- [ ] Accessibilité respectée (labels, contrastes, etc.)
- [ ] `npm run build` réussit sans erreur
