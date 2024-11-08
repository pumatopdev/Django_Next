from rest_framework import serializers
from .models import Product

class ProductListSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = ['product_id', 'product_name', 'product_price']

class ProductDetailSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = ['product_id', 'product_name', 'product_price', 'product_explanation']

class ProductCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = ['product_id','product_name', 'product_price', 'product_explanation']