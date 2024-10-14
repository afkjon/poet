import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Loading from './ui/Loading'

// Navbar component
const Navbar: React.FC = () => {
  const { user_id, isLoading, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <nav className="bg-blue-500 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link
            to="/"
            className="hover:text-gray-300 no-underline text-inherit"
          >
            Poet
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/documents" className="text-white hover:text-gray-300">
              Documents
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:text-gray-300">
              Profile
            </Link>
          </li>
          {/*
          <li>
            <Link to="/boards" className="text-white hover:text-gray-300">
              Boards
            </Link>
          </li>
          */}
          {isLoading ? (
            <Loading />
          ) : user_id ? (
            <li>
              <Link
                to="/login"
                onClick={logout}
                className="text-white bg-orange-500 hover:bg-orange-800 px-4 py-2 rounded-md"
              >
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
