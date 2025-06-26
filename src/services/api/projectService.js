import projectsData from '@/services/mockData/projects.json'

let projects = [...projectsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll() {
    await delay(200)
    return [...projects].sort((a, b) => a.order - b.order)
  },

  async getById(id) {
    await delay(150)
    const project = projects.find(p => p.id === id)
    if (!project) {
      throw new Error('Project not found')
    }
    return { ...project }
  },

  async create(projectData) {
    await delay(300)
    const maxId = Math.max(...projects.map(p => parseInt(p.id, 10)), 0)
    const newProject = {
      id: (maxId + 1).toString(),
      name: projectData.name,
      color: projectData.color || '#808080',
      icon: projectData.icon || 'Folder',
      order: projectData.order ?? projects.length,
      parentId: projectData.parentId || null,
      ...projectData
    }
    projects.push(newProject)
    return { ...newProject }
  },

  async update(id, updateData) {
    await delay(250)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    projects[index] = { ...projects[index], ...updateData }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay(200)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    projects.splice(index, 1)
    return true
  }
}