import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { parseTaskInput } from '@/utils/taskParser'

const QuickAddTask = ({ onAddTask, loading = false }) => {
  const [taskInput, setTaskInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!taskInput.trim()) return

    try {
      const parsedTask = parseTaskInput(taskInput)
      await onAddTask(parsedTask)
      setTaskInput('')
      setIsExpanded(false)
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setTaskInput('')
    }
  }

  return (
    <motion.div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm"
      animate={isExpanded ? { 
        boxShadow: '0 4px 12px -1px rgb(0 0 0 / 0.15)' 
      } : {}}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
          </div>
          
          <div className="flex-1">
            <Input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task... Try 'Meeting tomorrow at 2pm #work p1'"
              className="border-none shadow-none p-0 focus:ring-0 text-base"
            />
          </div>
          
          {taskInput.trim() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <Button
                type="submit"
                size="sm"
                loading={loading}
                className="px-3"
              >
                Add Task
              </Button>
              
              <button
                type="button"
                onClick={() => {
                  setTaskInput('')
                  setIsExpanded(false)
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </motion.div>
          )}
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 <strong>Quick shortcuts:</strong></p>
              <p>• Use #project or @project to set project</p>
              <p>• Add p1, p2, p3, or p4 for priority</p>
              <p>• Use "today", "tomorrow", or "at 2pm" for dates</p>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

export default QuickAddTask