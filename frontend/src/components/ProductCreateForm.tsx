import React, {useState} from "react";
import { useProductContext } from "@/context/ProductContext";

const ProductCreateForm = () => {
  const {createProduct, loading, error} = useProductContext();
  const [productData, setProductData] = useState({
    product_id:'',
    product_name: '',
    product_price: 0,
    product_explanation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    const {name, value} = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct(productData);
    setProductData({
        product_id:'',
        product_name: '',
        product_price: 0,
        product_explanation: '',
    });
  };

  return(
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label className="text-white">Product Name:</label>
                <input
                    type="text"
                    name="product_name"
                    value={productData.product_name}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <div>
                <label className="text-white">Product Price:</label>
                <input
                    type="number"
                    name="product_price"
                    value={productData.product_price}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <div>
                <label className="text-white">Product Explanation:</label>
                <textarea
                    name="product_explanation"
                    value={productData.product_explanation}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
  );
}

export default ProductCreateForm;