import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UsuarioProvider } from './context/UsuarioProvider.jsx'
import theme from './theme/theme.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <UsuarioProvider>
          <App />
        </UsuarioProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
