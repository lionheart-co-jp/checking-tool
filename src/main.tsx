import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline'

// Components
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />

    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
