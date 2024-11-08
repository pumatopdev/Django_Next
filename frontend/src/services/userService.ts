import api from './axiosInstance'
import { isAxiosError } from 'axios'

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
    const response = await api.get('admin/users/');
    return{
      success: true,
      data: response.data.data
    }
  } catch (error) {
    return handleError(error);
  }
};

export const createUser = async(userData: any) => {
  try {
    const response = await api.post('/admin/users/', userData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};

export const deleteUser = async (user_id: string) => {
  try {
    const response = await api.delete(`admin/users/${user_id}/`);
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
    const response = await api.put(`admin/users/${userId}/`, updateData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}


export const getProfile = async () => {
  try {
    const response = await api.get('profile/');
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}

export const updateProfile = async (updateData:any) => {
  try {
    const response = await api.put('profile/', updateData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}
