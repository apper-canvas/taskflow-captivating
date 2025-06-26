import { useState } from 'react'
import { motion } from 'framer-motion'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { formatTaskDate, formatTime, isOverdue } from '@/utils/dateUtils'
import { useProjects } from '@/hooks/useProjects'

const TaskItem = ({ 
  task, 
  onToggle, 
  onUpdate, 
  onDelete,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const { projects } = useProjects()
  
  const project = projects.find(p => p.id === task.projectId)
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && !task.completed
  
  const priorityLabels = {
    1: 'P1',
    2: 'P2', 
    3: 'P3',
    4: 'P4'
  }
  
  const priorityColors = {
    1: 'priority-1',
    2: 'priority-2',
    3: 'priority-3', 
    4: 'priority-4'
  }

  const handleSaveEdit = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      try {
        await onUpdate(task.id, { title: editTitle.trim() })
      } catch (error) {
        setEditTitle(task.title) // Reset on error
      }
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed ? 0.6 : 1, 
        y: 0,
        scale: task.completed ? 0.98 : 1
      }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 4px 12px -1px rgb(0 0 0 / 0.1)'
      }}
      className={`
        group bg-white border border-gray-200 rounded-lg p-4 cursor-pointer
        transition-all duration-200 hover:border-gray-300
        ${task.completed ? 'bg-gray-50' : ''}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            priority={task.priority}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-primary-500 rounded px-1 -mx-1"
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className={`
                text-sm font-medium rounded px-1 -mx-1 hover:bg-gray-50
                ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
              `}
            >
              {task.title}
            </div>
          )}
          
          {task.description && (
            <p className={`
              text-xs mt-1 
              ${task.completed ? 'text-gray-400' : 'text-gray-600'}
            `}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mt-2">
            {project && project.id !== '1' && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-xs text-gray-500">{project.name}</span>
              </div>
            )}
            
            {task.priority < 4 && (
              <div className={`priority-flag ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </div>
            )}
            
            {task.dueDate && (
              <div className={`
                text-xs px-2 py-0.5 rounded-full
                ${isTaskOverdue 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {formatTaskDate(task.dueDate)}
                {formatTime(task.dueDate) && (
                  <span className="ml-1">
                    {formatTime(task.dueDate)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem