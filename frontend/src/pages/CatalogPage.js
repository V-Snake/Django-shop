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
  Slider,
} from '@mui/material';
import { Link } from 'react-router-dom';

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0); // Nombre total de produits
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5; // Correspond à PAGE_SIZE dans le backend
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]); // Plage de prix pour le slider
  const [maxPriceValue, setMaxPriceValue] = useState(100); // Valeur maximale du prix dans la base de données
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState(''); // Pour le tri

  useEffect(() => {
    // Obtenir les catégories
    api.get('categories/').then((response) => {
      setCategories(response.data);
    });

    // Obtenir le prix maximum pour le slider
    api.get('products/').then((response) => {
      const prices = response.data.results.map((product) => product.price);
      const maxPrice = Math.max(...prices, 100); // Valeur par défaut de 100 si pas de produits
      setMaxPriceValue(maxPrice);
      setPriceRange([0, maxPrice]);
    });
  }, []);

  const fetchProducts = () => {
    let params = {};

    if (selectedCategory) {
      params.category = selectedCategory;
    }
    if (priceRange[0] > 0) {
      params.price__gte = priceRange[0];
    }
    if (priceRange[1] < maxPriceValue) {
      params.price__lte = priceRange[1];
    }
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (ordering) {
      params.ordering = ordering;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, priceRange, searchTerm, ordering, currentPage]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value);
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
          <InputLabel id="category-label" sx={{ color: 'text.primary' }}>
            Catégorie
          </InputLabel>
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

        {/* Slider pour la plage de prix */}
        <Typography gutterBottom color="text.primary">
          Prix : {priceRange[0]}€ - {priceRange[1]}€
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={maxPriceValue}
          sx={{ color: 'primary.main', mb: 2 }}
        />

        {/* Menu déroulant pour le tri */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="ordering-label" sx={{ color: 'text.primary' }}>
            Trier par
          </InputLabel>
          <Select
            labelId="ordering-label"
            value={ordering}
            onChange={handleOrderingChange}
            label="Trier par"
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
              <em>Par défaut</em>
            </MenuItem>
            <MenuItem value="name">Nom (A-Z)</MenuItem>
            <MenuItem value="-name">Nom (Z-A)</MenuItem>
            <MenuItem value="price">Prix croissant</MenuItem>
            <MenuItem value="-price">Prix décroissant</MenuItem>
          </Select>
        </FormControl>
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
