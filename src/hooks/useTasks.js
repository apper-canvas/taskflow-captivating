import { useState, useEffect } from 'react'
import { taskService } from '@/services/api/taskService'
import { toast } from 'react-toastify'

export const useTasks = (filter = 'all') => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let tasksData
      switch (filter) {
        case 'today':
          tasksData = await taskService.getTodayTasks()
          break
        case 'upcoming':
          tasksData = await taskService.getUpcomingTasks()
          break
        default:
          tasksData = await taskService.getAll()
      }
      
      setTasks(tasksData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [...prev, newTask])
      toast.success('Task added successfully')
      return newTask
    } catch (err) {
      toast.error('Failed to add task')
      throw err
    }
  }

  const updateTask = async (id, updateData) => {
    try {
      const updatedTask = await taskService.update(id, updateData)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      toast.error('Failed to update task')
      throw err
    }
  }

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id)
      setTasks(prev => prev.filter(task => task.id !== id))
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
      throw err
    }
  }

  const toggleTask = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉')
      }
      
      return updatedTask
    } catch (err) {
      toast.error('Failed to update task')
      throw err
    }
  }

  useEffect(() => {
    loadTasks()
  }, [filter])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refreshTasks: loadTasks
  }
}