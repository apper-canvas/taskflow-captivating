import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const Header = ({ onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/' || path === '/today') return 'Today'
    if (path === '/upcoming') return 'Upcoming'
    if (path.startsWith('/project/')) return 'Project'
    if (path === '/search') return 'Search Results'
    return 'TaskFlow'
  }
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <motion.h1 
            key={getPageTitle()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            {getPageTitle()}
          </motion.h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 w-64"
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header