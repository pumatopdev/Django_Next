"use client"

import React, {useEffect} from "react";
import { useProductContext } from "@/context/ProductContext";
import Link from "next/link";

const ProductList = ()=>{
  const {products, fetchProducts, loading, error} = useProductContext();

  useEffect(()=>{
    fetchProducts();
  },[]);

  if(loading) return <p>Loading...</p>
  if(error) return <p>{error}</p>

  return (
    <div>
    <h2>Product List</h2>
    <ul>
        {products.map((product) => (
            <li key={product.product_id}>
                <Link href={`/product/${product.product_id}`}>
                    {product.product_name} - ${product.product_price}
                </Link>
            </li>
        ))}
    </ul>
</div>
);

};


export default ProductList;