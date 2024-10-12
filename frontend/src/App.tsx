import React from 'react'
import { FirebaseProvider } from './providers/FirebaseProvider'
import './App.css'
import BoardList from './components/BoardList'
import DocumentList from './components/DocumentList'
import DocumentDetails from './components/DocumentDetails'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
// Main layout for the app
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-4">
        <Toaster />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Main App component
export const App: React.FC = () => {
  const queryProvider = new QueryClient()

  return (
    <FirebaseProvider>
      <QueryClientProvider client={queryProvider}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<BoardList />} />
              <Route path="/boards" element={<BoardList />} />
              <Route path="/documents" element={<DocumentList />} />
              <Route path="/documents/:id" element={<DocumentDetails />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<div>Not found</div>} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </FirebaseProvider>
  )
}

export default App
