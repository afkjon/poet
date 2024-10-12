import { AxiosError } from 'axios'
import apiClient from './apiClient'
import { UserSchema, type User } from '../types/user'

export const userApi = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post(
        '/auth/login/',
        { email, password },
        { withCredentials: true },
      )
      return UserSchema.parse(response.data)
    } catch (error) {
      throw error as AxiosError
    }
  },
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout/', { withCredentials: true })
    } catch (error) {
      throw error as AxiosError
    }
  },
  register: async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post(
        '/auth/register/',
        { email, password },
        { withCredentials: true },
      )
      return UserSchema.parse(response.data)
    } catch (error) {
      throw error as AxiosError
    }
  },
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/me/', { withCredentials: true })
      return UserSchema.parse(response.data)
    } catch (error) {
      throw error as AxiosError
    }
  },
}
