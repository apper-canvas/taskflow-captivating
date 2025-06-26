import { motion } from 'framer-motion'
import QuickAddTask from '@/components/molecules/QuickAddTask'
import TaskList from '@/components/organisms/TaskList'
import { useTasks } from '@/hooks/useTasks'
import { formatTaskDate, getDaysUntilDue } from '@/utils/dateUtils'
import ApperIcon from '@/components/ApperIcon'

const UpcomingView = () => {
  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask 
  } = useTasks('upcoming')
  
  // Group tasks by date
  const groupedTasks = tasks.reduce((groups, task) => {
    if (!task.dueDate) return groups
    
    const daysUntilDue = getDaysUntilDue(task.dueDate)
    const dateKey = formatTaskDate(task.dueDate)
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: task.dueDate,
        daysUntil: daysUntilDue,
        tasks: []
      }
    }
    
    groups[dateKey].tasks.push(task)
    return groups
  }, {})
  
  // Sort groups by date
  const sortedGroups = Object.values(groupedTasks).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )
  
  const emptyState = {
    icon: 'Clock',
    title: 'No upcoming tasks',
    description: 'All caught up! Schedule some future tasks to stay organized.',
    actionLabel: 'Add Future Task'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Quick add */}
      <QuickAddTask onAddTask={addTask} loading={loading} />
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="Calendar" size={20} className="text-blue-500" />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900">
                {sortedGroups.length}
              </div>
              <div className="text-xs text-gray-500">
                Days with tasks
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="List" size={20} className="text-green-500" />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900">
                {tasks.length}
              </div>
              <div className="text-xs text-gray-500">
                Total upcoming
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ApperIcon name="AlertTriangle" size={20} className="text-orange-500" />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900">
                {tasks.filter(t => t.priority <= 2).length}
              </div>
              <div className="text-xs text-gray-500">
                High priority
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grouped tasks */}
      <div className="space-y-6">
        {sortedGroups.length > 0 ? (
          sortedGroups.map((group, index) => (
            <motion.div
              key={group.date.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatTaskDate(group.date)}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      {group.tasks.filter(t => !t.completed).length} remaining
                    </span>
                    {group.daysUntil !== null && (
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${group.daysUntil === 0 
                          ? 'bg-green-100 text-green-800' 
                          : group.daysUntil === 1 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                        }
                      `}>
                        {group.daysUntil === 0 
                          ? 'Today' 
                          : group.daysUntil === 1 
                          ? 'Tomorrow'
                          : `${group.daysUntil} days`
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <TaskList
                  tasks={group.tasks}
                  loading={false}
                  error={error}
                  onToggleTask={toggleTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            </motion.div>
          ))
        ) : (
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

export default UpcomingView