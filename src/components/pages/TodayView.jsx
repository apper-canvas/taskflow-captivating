import { motion } from "framer-motion";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import TaskList from "@/components/organisms/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { formatTaskDate } from "@/utils/dateUtils";
import ApperIcon from "@/components/atoms/ApperIcon";
import React from "react";
const TodayView = () => {
  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask 
  } = useTasks('today')
  
  const today = new Date()
  const todayString = formatTaskDate(today)
  
  // Group tasks by time if they have specific times
  const groupedTasks = tasks.reduce((groups, task) => {
    if (!task.dueDate) {
      groups.noTime = groups.noTime || []
      groups.noTime.push(task)
    } else {
      const time = task.dueDate.getHours()
      if (time === 0 && task.dueDate.getMinutes() === 0) {
        groups.allDay = groups.allDay || []
        groups.allDay.push(task)
      } else {
        groups.timed = groups.timed || []
        groups.timed.push(task)
      }
    }
    return groups
  }, {})
  
  // Sort timed tasks by time
  if (groupedTasks.timed) {
    groupedTasks.timed.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
  }
  
  const emptyState = {
    icon: 'Calendar',
    title: 'No tasks for today',
    description: 'Great! You have a clear schedule. Add a task to get started.',
    actionLabel: 'Add Your First Task'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Quick add */}
      <QuickAddTask onAddTask={addTask} loading={loading} />
      
      {/* Today's overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {todayString}
            </h2>
            <p className="text-sm text-gray-600">
              {tasks.length === 0 
                ? 'No tasks scheduled' 
                : `${tasks.filter(t => !t.completed).length} of ${tasks.length} tasks remaining`
              }
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {tasks.filter(t => t.completed).length}
            </div>
            <div className="text-xs text-gray-500">
              Completed
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
      
      {/* Task groups */}
      <div className="space-y-6">
        {/* Timed tasks */}
        {groupedTasks.timed && groupedTasks.timed.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ApperIcon name="Clock" size={16} className="mr-2" />
              Scheduled
            </h3>
            <TaskList
              tasks={groupedTasks.timed}
              loading={false}
              error={error}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </div>
        )}
        
        {/* All day tasks */}
        {groupedTasks.allDay && groupedTasks.allDay.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              All Day
            </h3>
            <TaskList
              tasks={groupedTasks.allDay}
              loading={false}
              error={error}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </div>
        )}
        
        {/* Tasks without time */}
        {groupedTasks.noTime && groupedTasks.noTime.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ApperIcon name="List" size={16} className="mr-2" />
              No Time Set
            </h3>
            <TaskList
              tasks={groupedTasks.noTime}
              loading={false}
              error={error}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </div>
        )}
        
        {/* Show empty state if no tasks at all */}
        {tasks.length === 0 && (
          <TaskList
            tasks={[]}
            loading={loading}
            error={error}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            emptyState={emptyState}
          />
        )}
      </div>
    </motion.div>
  )
}

export default TodayView