import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import ProjectItem from '@/components/molecules/ProjectItem'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'

const Sidebar = ({ isOpen, onToggle }) => {
  const { projects, loading: projectsLoading } = useProjects()
  const { tasks } = useTasks()
  
  // Calculate task counts for each project
  const getTaskCount = (projectId) => {
    return tasks.filter(task => task.projectId === projectId && !task.completed).length
  }
  
  const todayTasksCount = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === today.toDateString()
  }).length
  
  const upcomingTasksCount = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate > today
  }).length

  const navigationItems = [
    {
      name: 'Today',
      path: '/today',
      icon: 'Calendar',
      count: todayTasksCount
    },
    {
      name: 'Upcoming',
      path: '/upcoming', 
      icon: 'Clock',
      count: upcomingTasksCount
    }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 z-50 h-full w-80 bg-white border-r border-gray-200 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            
            <button
              onClick={onToggle}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Main navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={item.icon} size={16} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  {item.count > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
            
            {/* Projects section */}
            <div className="pt-6">
              <div className="flex items-center justify-between px-3 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Projects
                </h3>
              </div>
              
              <div className="space-y-1">
                {projectsLoading ? (
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  projects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      taskCount={getTaskCount(project.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </nav>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar