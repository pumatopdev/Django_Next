"use client";

import React, { useEffect } from "react";
import { useProductContext } from "@/context/ProductContext";

interface DetailProps {
  product_id: string;
}

const ProductDetail: React.FC<DetailProps> = ({ product_id }) => {
  const { selectedProduct, fetchProductDetails, loading, error } = useProductContext();

  useEffect(() => {
    if (product_id) {
      fetchProductDetails(product_id);
    }
  }, [product_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!selectedProduct) return <p>No product details found</p>;

  return (
    <div>
      <h2>{selectedProduct.product_name}</h2>
      <p>Price: ${selectedProduct.product_price}</p>
      <p>{selectedProduct.product_explanation}</p>
    </div>
  );
};

export default ProductDetail;