import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api'; // Django backend URL

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

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { email, password });
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};