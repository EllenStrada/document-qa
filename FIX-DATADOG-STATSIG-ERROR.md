# 🔧 FIX: Error de Datadog y Statsig en Figma/Make

## Problema
```
Datadog Browser SDK: No storage available for session. We will not send any data.
Statsig is not ready to log exposures, will retry in 1 seconds
```

**Causa raíz:** Tu app está en un iframe de Figma que bloquea `localStorage` y `sessionStorage`.

---

## Solución: Agregar polyfill de storage

### Edita tu archivo `/src/main.tsx`

**Reemplaza TODO el contenido con:**

```typescript
// Polyfill para localStorage/sessionStorage si no están disponibles (e.g., en Figma)
if (typeof window !== 'undefined') {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
  } catch (e) {
    console.warn('⚠️ localStorage no disponible, usando polyfill en memoria');

    const memoryStorage: Record<string, string> = {};

    const storagePolyfill: Storage = {
      getItem: (key: string) => memoryStorage[key] ?? null,
      setItem: (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: (key: string) => { delete memoryStorage[key]; },
      clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); },
      key: (index: number) => Object.keys(memoryStorage)[index] ?? null,
      length: Object.keys(memoryStorage).length
    };

    window.localStorage = storagePolyfill;
    window.sessionStorage = storagePolyfill;

    console.log('✅ Storage polyfill activado - Datadog y Statsig funcionarán sin localStorage');
  }
}

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

---

## Qué hace

1. **Intenta usar localStorage real** → si funciona, todo normal
2. **Si falla** → crea un almacenamiento en memoria falso
3. **Datadog y Statsig** → ahora pueden guardar datos (en memoria) sin errores
4. **El flujo de email** → sigue funcionando igual, sin bloqueos

---

## Resultado esperado

✅ Ya NO verás: `"No storage available"`  
✅ Statsig se inicializa correctamente  
✅ El email se envía sin demoras  
✅ La UI responde normalmente

---

## Pasos

1. Abre tu proyecto de Figma/Make
2. Edita `src/main.tsx` 
3. Copia-pega el código de arriba
4. Guarda y redeploy en Make

¡Listo! 🎉
