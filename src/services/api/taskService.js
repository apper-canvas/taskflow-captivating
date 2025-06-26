import tasksData from '@/services/mockData/tasks.json'

let tasks = tasksData.map(task => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate) : null,
  createdAt: new Date(task.createdAt)
}))

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(200)
    return tasks.map(task => ({ ...task }))
  },

  async getById(id) {
    await delay(150)
    const task = tasks.find(t => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async getByProject(projectId) {
    await delay(200)
    return tasks
      .filter(task => task.projectId === projectId)
      .map(task => ({ ...task }))
      .sort((a, b) => a.order - b.order)
  },

  async getTodayTasks() {
    await delay(200)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return tasks
      .filter(task => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        return taskDate >= today && taskDate < tomorrow
      })
      .map(task => ({ ...task }))
      .sort((a, b) => a.priority - b.priority)
  },

  async getUpcomingTasks() {
    await delay(200)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks
      .filter(task => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        return taskDate >= today
      })
      .map(task => ({ ...task }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  },

  async create(taskData) {
    await delay(300)
    const maxId = Math.max(...tasks.map(t => parseInt(t.id, 10)), 0)
    const newTask = {
      id: (maxId + 1).toString(),
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId || '1',
      priority: taskData.priority || 4,
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date(),
      order: taskData.order ?? tasks.length + 1,
      ...taskData
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(250)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks[index] = { ...tasks[index], ...updateData }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks.splice(index, 1)
    return true
  },

  async toggleComplete(id) {
    await delay(150)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks[index].completed = !tasks[index].completed
    return { ...tasks[index] }
  },

  async search(query) {
    await delay(250)
    const searchTerm = query.toLowerCase()
    return tasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      )
      .map(task => ({ ...task }))
      .sort((a, b) => a.priority - b.priority)
  }
}