from django.contrib import admin
from .models import Product, Category  # Import des modèles

# Enregistrement des modèles dans l'admin
admin.site.register(Product)
admin.site.register(Category)
