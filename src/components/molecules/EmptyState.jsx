import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ 
  icon = 'CheckCircle',
  title = 'No tasks yet',
  description = 'Add your first task to get started',
  action,
  actionLabel = 'Add Task',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-primary-500"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {action && (
        <Button onClick={action} className="mx-auto">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState