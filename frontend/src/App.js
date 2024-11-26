// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import NavBar from './components/NavBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#39FF14', // Neon Green
    },
    secondary: {
      main: '#FFFF33', // Neon Yellow
    },
    background: {
      default: '#121212', // Dark background
    },
    text: {
      primary: '#FFFFFF', // White text
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
