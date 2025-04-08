// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Criando um tema customizado inspirado nos tons da Amazon (por exemplo, azul escuro e laranja)
const theme = createTheme({
  palette: {
    primary: {
      main: '#146eb4', // Azul escuro
    },
    secondary: {
      main: '#ff9900', // Laranja (tom usado pela Amazon)
    },
    background: {
      default: '#f4f6f8',
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
