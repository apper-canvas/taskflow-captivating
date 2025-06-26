import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const ProjectItem = ({ 
  project, 
  taskCount = 0, 
  isActive = false,
  className = ''
}) => {
  const linkPath = project.name === 'Inbox' ? '/' : `/project/${project.id}`
  
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className={className}
    >
      <NavLink
        to={linkPath}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 group
          ${isActive 
            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
            : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <ApperIcon 
              name={project.icon} 
              size={16} 
              className="flex-shrink-0"
            />
            <span className="font-medium truncate">
              {project.name}
            </span>
          </div>
        </div>
        
        {taskCount > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {taskCount}
          </span>
        )}
      </NavLink>
    </motion.div>
  )
}

export default ProjectItem