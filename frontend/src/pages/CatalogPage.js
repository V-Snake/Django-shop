import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Grid2,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    api.get('categories/').then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    let params = {};
    if (selectedCategory) {
      params.category = selectedCategory;
    }
    if (minPrice) {
      params.price__gte = minPrice;
    }
    if (maxPrice) {
      params.price__lte = maxPrice;
    }

    api.get('products/', { params }).then((response) => {
      setProducts(response.data);
    });
  }, [selectedCategory, minPrice, maxPrice]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Grid2 container spacing={2} sx={{ padding: 2 }}>
      {/* Section des filtres */}
      <Grid2 xs={12} sm={3}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label" sx={{ color: 'text.primary' }}>Catégorie</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Catégorie"
            sx={{
              backgroundColor: 'white', // Fond blanc pour le sélecteur
              color: 'black', // Texte noir pour le sélecteur
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'black', // Bordure noire
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'gray', // Bordure grise au survol
              },
              '.MuiSvgIcon-root': {
                color: 'black', // Icône noire
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'white', // Fond blanc pour le menu déroulant
                  color: 'black', // Texte noir pour les options
                },
              },
            }}
          >
            <MenuItem value="">
              <em>Toutes les catégories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.id}
                sx={{
                  backgroundColor: 'white', // Fond blanc pour chaque option
                  color: 'black', // Texte noir pour chaque option
                  '&:hover': {
                    backgroundColor: '#f0f0f0', // Fond gris clair au survol
                  },
                }}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Prix minimum"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              sx: { color: 'black', backgroundColor: 'white' },
            },
            label: {
              sx: { color: 'black' },
            },
          }}
        />
        <TextField
          label="Prix maximum"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              sx: { color: 'black', backgroundColor: 'white' },
            },
            label: {
              sx: { color: 'black' },
            },
          }}
        />
      </Grid2>

      {/* Section des produits */}
      <Grid2 xs={12} sm={9}>
        <Grid2 container spacing={2}>
          {products.map((product) => {
            const imageUrl = product.image;
            return (
              <Grid2 xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ backgroundColor: '#1e1e1e' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent>
                    <Typography variant="h6" color="text.primary">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {product.price} €
                    </Typography>
                    <Button
                      component={Link}
                      to={`/product/${product.id}`}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Voir le produit
                    </Button>
                  </CardContent>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default CatalogPage;
