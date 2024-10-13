import React from 'react'
import RegisterForm from './RegisterForm'
import { useAuthStore } from '../stores/authStore'
import { Navigate } from 'react-router-dom'

const RegisterPage: React.FC = () => {
  const { hasSession } = useAuthStore()
  if (hasSession) {
    return <Navigate to="/" />
  }
  return <RegisterForm />
}

export default RegisterPage
