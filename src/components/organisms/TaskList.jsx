import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "@/components/molecules/TaskItem";
import EmptyState from "@/components/molecules/EmptyState";
import LoadingSpinner from "@/components/molecules/LoadingSpinner";
import Icon from "@/components/atoms/Icon";
import React from "react";
const TaskList = ({ 
  tasks = [], 
  loading = false,
  error = null,
  onToggleTask,
  onUpdateTask, 
  onDeleteTask,
  emptyState,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (error) {
    return (
<div className={`py-12 text-center ${className}`}>
        <div className="text-red-500 mb-4">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-2" />
          <p className="text-lg font-medium">Something went wrong</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }
  
  if (tasks.length === 0) {
    return (
      <div className={className}>
        <EmptyState {...emptyState} />
      </div>
    )
  }
  
  // Group tasks by completion status
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Active tasks */}
      <AnimatePresence>
        {activeTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <TaskItem
              task={task}
              onToggle={onToggleTask}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Completed tasks section */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-6 border-t border-gray-200"
>
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="CheckCircle" size={16} className="text-green-500" />
            <h3 className="text-sm font-medium text-gray-700">
              Completed ({completedTasks.length})
            </h3>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <TaskItem
                    task={task}
                    onToggle={onToggleTask}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TaskList