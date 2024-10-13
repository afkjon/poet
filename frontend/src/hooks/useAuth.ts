import { useState } from 'react'
import { userApi } from '../services/userApi'
import { toast } from 'react-hot-toast'

export const useAuth = () => {
  const [user_id, setUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const userData = await userApi.login(username, password)
      setUserId(userData.user_id)
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error('Invalid username or password')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await userApi.logout()
      setUserId(null)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, password: string) => {
    setLoading(true)
    try {
      const userData = await userApi.register(username, password)
      setUserId(userData.user_id)
      toast.success('Registered successfully')
    } catch (error) {
      toast.error('Failed to register')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    setLoading(true)
    try {
      const userData = await userApi.checkAuth()
      setUserId(userData.user_id)
    } catch (error) {
      toast.error('Failed to get current user')
      console.error('Get current user error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { user_id, loading, login, logout, register, checkAuth }
}
