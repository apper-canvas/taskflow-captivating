import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns'

export const formatTaskDate = (date) => {
  if (!date) return null
  
  const taskDate = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(taskDate)) {
    return 'Today'
  }
  
  if (isTomorrow(taskDate)) {
    return 'Tomorrow'
  }
  
  if (isThisWeek(taskDate)) {
    return format(taskDate, 'EEEE')
  }
  
  return format(taskDate, 'MMM d')
}

export const formatTime = (date) => {
  if (!date) return null
  const taskDate = typeof date === 'string' ? parseISO(date) : date
  return format(taskDate, 'h:mm a')
}

export const isOverdue = (date) => {
  if (!date) return false
  const taskDate = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  return taskDate < now
}

export const getDaysUntilDue = (date) => {
  if (!date) return null
  const taskDate = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  taskDate.setHours(0, 0, 0, 0)
  
  const diffTime = taskDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}