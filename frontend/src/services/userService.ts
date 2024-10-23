import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api';  // Your Django backend URL

export type ApiResponse = {
  success: true,
  data: any
} | {
  success: false,
  message: string
}

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

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};

export const createUser = async(userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/`);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }

};

export const updateUser = async (userId:string, updateData:any) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/`, updateData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}
