import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  priority = 4,
  disabled = false,
  className = '',
  ...props 
}) => {
  const priorityClasses = {
    1: 'priority-1',
    2: 'priority-2', 
    3: 'priority-3',
    4: ''
  }
  
  const checkboxClasses = `
    task-checkbox
    ${checked ? 'completed' : ''}
    ${priorityClasses[priority]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `
  
  return (
    <motion.div
      className={checkboxClasses}
      onClick={!disabled ? onChange : undefined}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={checked ? { 
        backgroundColor: '#DC4C3E',
        borderColor: '#DC4C3E'
      } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex items-center justify-center w-full h-full"
        >
          <ApperIcon name="Check" size={12} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default Checkbox