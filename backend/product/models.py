from django.db import models
import uuid
# Create your models here.

class Product(models.Model):
  product_id = models.UUIDField(primary_key= True, default=uuid.uuid4, editable=False) #uuid4-> generate random id
  product_name = models.CharField(max_length=100)
  product_price = models.DecimalField(max_digits=10, decimal_places=2)
  product_explanation = models.TextField()

  def __str__(self):
    return self.product_name
