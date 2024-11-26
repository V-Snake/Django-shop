import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Grid,
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
  Pagination,
} from '@mui/material';
import { Link } from 'react-router-dom';

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0); // Nombre total de produits
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5; // Doit correspondre à PAGE_SIZE dans le backend
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('categories/').then((response) => {
      setCategories(response.data);
    });
  }, []);

  const fetchProducts = () => {
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
    if (searchTerm) {
      params.search = searchTerm;
    }
    params.page = currentPage;

    api.get('products/', { params }).then((response) => {
      setProducts(response.data.results);
      setCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, searchTerm, currentPage]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {/* Section des filtres */}
      <Grid item xs={12} sm={3}>
        <TextField
          label="Rechercher"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            sx: { color: 'black', backgroundColor: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'black' },
          }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label" sx={{ color: 'text.primary' }}>Catégorie</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Catégorie"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'gray',
              },
              '.MuiSvgIcon-root': {
                color: 'black',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'white',
                  color: 'black',
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
                  backgroundColor: 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
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
          onChange={handleMinPriceChange}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            sx: { color: 'black', backgroundColor: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'black' },
          }}
        />
        <TextField
          label="Prix maximum"
          type="number"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            sx: { color: 'black', backgroundColor: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'black' },
          }}
        />
      </Grid>

      {/* Section des produits */}
      <Grid item xs={12} sm={9}>
        <Grid container spacing={2}>
          {products.map((product) => {
            const imageUrl = product.image;
            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
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
              </Grid>
            );
          })}
        </Grid>
        {/* Contrôles de pagination */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default CatalogPage;
