import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import QuickAddTask from '@/components/molecules/QuickAddTask'
import TaskList from '@/components/organisms/TaskList'
import ApperIcon from '@/components/ApperIcon'
import { useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { taskService } from '@/services/api/taskService'

const ProjectView = () => {
  const { projectId } = useParams()
  const [projectTasks, setProjectTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { projects } = useProjects()
  const { addTask, updateTask, deleteTask, toggleTask } = useTasks()
  
  const project = projects.find(p => p.id === projectId)
  
  const loadProjectTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const tasks = await taskService.getByProject(projectId)
      setProjectTasks(tasks)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddTask = async (taskData) => {
    const newTask = await addTask({ ...taskData, projectId })
    setProjectTasks(prev => [...prev, newTask])
    return newTask
  }
  
  const handleUpdateTask = async (id, updateData) => {
    const updatedTask = await updateTask(id, updateData)
    setProjectTasks(prev => prev.map(task => 
      task.id === id ? updatedTask : task
    ))
    return updatedTask
  }
  
  const handleDeleteTask = async (id) => {
    await deleteTask(id)
    setProjectTasks(prev => prev.filter(task => task.id !== id))
  }
  
  const handleToggleTask = async (id) => {
    const updatedTask = await toggleTask(id)
    setProjectTasks(prev => prev.map(task => 
      task.id === id ? updatedTask : task
    ))
    return updatedTask
  }
  
  useEffect(() => {
    if (projectId) {
      loadProjectTasks()
    }
  }, [projectId])
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-600">This project may have been deleted or doesn't exist.</p>
      </div>
    )
  }
  
  const completedTasks = projectTasks.filter(task => task.completed)
  const activeTasks = projectTasks.filter(task => !task.completed)
  
  const emptyState = {
    icon: project.icon,
    title: `No tasks in ${project.name}`,
    description: 'Add your first task to this project to get started.',
    actionLabel: 'Add Task'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Project header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <ApperIcon 
              name={project.icon} 
              size={24} 
              style={{ color: project.color }}
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">
              {projectTasks.length === 0 
                ? 'No tasks yet' 
                : `${activeTasks.length} active, ${completedTasks.length} completed`
              }
            </p>
          </div>
        </div>
        
        {/* Project stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {projectTasks.length}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">
              {activeTasks.length}
            </div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">
              {completedTasks.length}
            </div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">
              {projectTasks.filter(t => t.priority <= 2 && !t.completed).length}
            </div>
            <div className="text-xs text-gray-500">Priority</div>
          </div>
        </div>
        
        {/* Progress bar */}
        {projectTasks.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {Math.round((completedTasks.length / projectTasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ 
                  background: `linear-gradient(to right, ${project.color}80, ${project.color})` 
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(completedTasks.length / projectTasks.length) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Quick add */}
      <QuickAddTask onAddTask={handleAddTask} loading={loading} />
      
      {/* Tasks */}
      <TaskList
        tasks={projectTasks}
        loading={loading}
        error={error}
        onToggleTask={handleToggleTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        emptyState={emptyState}
      />
    </motion.div>
  )
}

export default ProjectView