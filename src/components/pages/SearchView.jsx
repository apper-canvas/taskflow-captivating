import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import TaskList from '@/components/organisms/TaskList'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { useTasks } from '@/hooks/useTasks'

const SearchView = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { updateTask, deleteTask, toggleTask } = useTasks()
  
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const results = await taskService.search(query)
      setSearchResults(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (query) {
      setSearchParams({ q: query })
      performSearch(query)
    } else {
      setSearchParams({})
      setSearchResults([])
    }
  }
  
  const handleUpdateTask = async (id, updateData) => {
    const updatedTask = await updateTask(id, updateData)
    setSearchResults(prev => prev.map(task => 
      task.id === id ? updatedTask : task
    ))
    return updatedTask
  }
  
  const handleDeleteTask = async (id) => {
    await deleteTask(id)
    setSearchResults(prev => prev.filter(task => task.id !== id))
  }
  
  const handleToggleTask = async (id) => {
    const updatedTask = await toggleTask(id)
    setSearchResults(prev => prev.map(task => 
      task.id === id ? updatedTask : task
    ))
    return updatedTask
  }
  
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])
  
  const emptyState = {
    icon: 'Search',
    title: searchQuery 
      ? `No results for "${searchQuery}"` 
      : 'Start searching',
    description: searchQuery 
      ? 'Try different keywords or check your spelling.' 
      : 'Enter keywords to find your tasks.',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your tasks..."
              className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          {searchQuery && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {loading 
                  ? 'Searching...' 
                  : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found`
                }
              </p>
              
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSearchParams({})
                  setSearchResults([])
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear search
              </button>
            </div>
          )}
        </form>
      </div>
      
      {/* Search results */}
      {searchQuery && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
          </div>
          
          <div className="p-6">
            <TaskList
              tasks={searchResults}
              loading={loading}
              error={error}
              onToggleTask={handleToggleTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              emptyState={emptyState}
            />
          </div>
        </div>
      )}
      
      {/* Search tips */}
      {!searchQuery && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Search" size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <strong>Keywords:</strong> Search task titles and descriptions
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <ApperIcon name="Hash" size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <strong>Projects:</strong> Find tasks in specific projects
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Flag" size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <strong>Priority:</strong> Search by priority levels
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <strong>Dates:</strong> Find tasks by due dates
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default SearchView