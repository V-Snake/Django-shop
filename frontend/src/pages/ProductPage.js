// src/pages/ProductPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Container, Typography, CardMedia, Button } from '@mui/material';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`products/${id}/`).then((response) => {
      setProduct(response.data);
      console.log('Image URL:', response.data.image);  // Pour vérifier l'URL de l'image
    });
  }, [id]);

  if (!product) return <div>Chargement...</div>;

  const imageUrl = product.image;  // Utilisez l'URL telle qu'elle est

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <CardMedia component="img" height="400" image={imageUrl} alt={product.name} />
      <Typography variant="h5" color="secondary" style={{ marginTop: 20 }}>
        {product.price} €
      </Typography>
      <Typography variant="body1" style={{ marginTop: 20 }}>
        {product.description}
      </Typography>
      <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
        Ajouter au panier
      </Button>
    </Container>
  );
}

export default ProductPage;
