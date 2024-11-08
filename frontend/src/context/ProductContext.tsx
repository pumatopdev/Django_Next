"use client";

import React, {createContext, useContext, useState, useEffect, ReactNode, Children} from "react";
import {getProducts, getProductDetails, createNewProduct} from '../services/productService';
import exp from "constants";

interface Product {
  product_id: string;
  product_name: string;
  product_price: number;
  product_explanation: string;
}

interface ProductContextType {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string;
  fetchProducts: ()=>Promise<void>;
  fetchProductDetails: (product_id: string) => Promise<void>;
  setSelectedProduct: (product:Product | null) => void;
  createProduct: (newProduct:Product)=> Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if(!context) 
  {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}

export const ProductProvider = ({children}: {children:ReactNode}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async() => {
    setLoading(true);
    try{
      const response = await getProducts();
      if(response?.success){
        setProducts(response.data);
      }
    }catch{
      setError('Failed to load products');
    }finally{
      setLoading(false);
    }
  };

  const fetchProductDetails = async(product_id:string) => {
    setLoading(true);
    try{
      const response = await getProductDetails(product_id);
      if(response?.success){
        setSelectedProduct(response.data);
      }
    } catch{
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async(newProduct:Product) => {
    setLoading(true);
    try {
      const response = await createNewProduct(newProduct);
      if(response?.success){
        setProducts((prevProducts)=>[...prevProducts, response.data]);
      }
    } catch (error) {
      setError("Faild to create new product");
    } finally{
      setLoading(false);
    }
  }

  return(
    <ProductContext.Provider value={{products, selectedProduct, loading,error, fetchProducts, fetchProductDetails, setSelectedProduct, createProduct}}>
      {children}
    </ProductContext.Provider>
  );
};