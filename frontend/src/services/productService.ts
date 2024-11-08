import api from "./axiosInstance";
import { isAxiosError } from "axios";


const handleError = (err: any): {
  success: false,
  message: string
} => {
  if (isAxiosError(err)) {
    if (err.response) {
      return {
        success: false,
        message: err.response.data.message
      }
    }
    if (err.request) {
      return {
        success: false,
        message: err.request.data.message
      }
    }
  }

  return {
    success: false,
    message: err
  }
}
export const getProducts = async() => {
  try {
    const response = await api.get('products/');
    console.log("sdfsdfsd"+response.data.data);
    return {success: true, data: response.data.data}
  } catch (error) {
    handleError(error);
  }
}

export const getProductDetails = async (product_id: string) => {
  try {
    const response = await api.get(`products/${product_id}/`);
    return {success:true, data: response.data.data};
  } catch (error) {
    handleError(error);
  }
}

export const createNewProduct = async(newProduct: any)=>{
  try{
    const response = await api.post('products/', newProduct);
    return {success: true, data: response.data.data};
  }catch(error){
    handleError(error);
  }
}