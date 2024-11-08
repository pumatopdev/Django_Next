from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .models import Product
from .serializers import ProductDetailSerializer, ProductListSerializer, ProductCreateSerializer

class ProductListCreateView(generics.ListCreateAPIView):   # Concrete view for listing a queryset or creating a model instance.
  queryset = Product.objects.all()

  def get_serializer_class(self):
    if self.request.method == 'POST':
      return ProductCreateSerializer
    return ProductListSerializer
  
  def get_permissions(self):
    if self.request.method == 'POST':
      return [permissions.IsAdminUser()]
    return [permissions.AllowAny()]
  
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = self.get_serializer(queryset, many = True)
    return Response({"success":True, "data": serializer.data})
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "data": serializer.data},status = status.HTTP_201_CREATED)
    return Response({"success":False, "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
  

class ProductDetailView(generics.RetrieveAPIView): #Concrete view for retrieving a model instance.
  queryset = Product.objects.all()
  serializer_class = ProductDetailSerializer
  lookup_field = "product_id"
  permission_classes = [permissions.AllowAny]

  def retrieve(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = self.get_serializer(instance)
    print(serializer)
    return Response({"success":True, "data": serializer.data})
  
