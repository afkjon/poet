import React from 'react'
import { Link } from 'react-router-dom'

// Navbar component
const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Poet</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/boards" className="text-white hover:text-gray-300">
              Boards
            </Link>
          </li>
          <li>
            <Link to="/documents" className="text-white hover:text-gray-300">
              Documents
            </Link>
          </li>
          <li>
            <Link to="/blog" className="text-white hover:text-gray-300">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
