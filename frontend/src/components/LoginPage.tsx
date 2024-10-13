import React from 'react'
import LoginForm from './LoginForm'
import { useAuthStore } from '../stores/authStore'
import { Navigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const { hasSession } = useAuthStore()
  if (hasSession) {
    return <Navigate to="/" />
  }
  return <LoginForm />
}

export default LoginPage
