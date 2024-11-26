// src/pages/HomePage.js

import React from 'react';
import { Container, Typography } from '@mui/material';

function HomePage() {
  return (
    <Container>
      <Typography variant="h2" gutterBottom style={{ marginTop: 20 }}>
        Bienvenue sur notre boutique de vêtements cyberpunk
      </Typography>
      <Typography variant="body1">
        Découvrez notre collection de vêtements futuristes et stylés pour adopter un look unique et tendance.
      </Typography>
    </Container>
  );
}

export default HomePage;
