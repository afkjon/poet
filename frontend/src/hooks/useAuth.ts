import { useState } from 'react'
import { userApi } from '../services/userApi'
import { toast } from 'react-hot-toast'
import { User } from '../types/user'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const userData = await userApi.login(username, password)
      setUser(userData)
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
      setUser(null)
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
      setUser(userData)
      toast.success('Registered successfully')
    } catch (error) {
      toast.error('Failed to register')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    setLoading(true)
    try {
      const userData = await userApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      toast.error('Failed to get current user')
      console.error('Get current user error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, login, logout, register, getCurrentUser }
}
