# products/serializers.py

from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category', 'image', 'stock']
