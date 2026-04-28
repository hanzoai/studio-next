import React from 'react'
import ReactDOM from 'react-dom/client'
import { GuiProvider } from '@hanzo/gui'
import { config } from './gui.config'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GuiProvider config={config} defaultTheme="dark">
      <App />
    </GuiProvider>
  </React.StrictMode>
)
