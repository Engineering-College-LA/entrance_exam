import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MoRegPrototype } from './moReg/MoRegPrototype.tsx'

// MO-Reg prototype is intentionally routed here, outside the main app's
// PageId/ExamType system — it's a standalone UI review, not a real feature.
// Delete this check + src/moReg/ to remove it entirely.
const isMoRegPrototype = window.location.pathname.replace(/\/$/, '') === '/mo-reg'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isMoRegPrototype ? <MoRegPrototype /> : <App />}
  </StrictMode>,
)
