import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Django backend URL

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
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
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};