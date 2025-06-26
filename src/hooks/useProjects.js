import { useState, useEffect } from 'react'
import { projectService } from '@/services/api/projectService'
import { toast } from 'react-toastify'

export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects(prev => [...prev, newProject])
      toast.success('Project created successfully')
      return newProject
    } catch (err) {
      toast.error('Failed to create project')
      throw err
    }
  }

  const updateProject = async (id, updateData) => {
    try {
      const updatedProject = await projectService.update(id, updateData)
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ))
      return updatedProject
    } catch (err) {
      toast.error('Failed to update project')
      throw err
    }
  }

  const deleteProject = async (id) => {
    try {
      await projectService.delete(id)
      setProjects(prev => prev.filter(project => project.id !== id))
      toast.success('Project deleted')
    } catch (err) {
      toast.error('Failed to delete project')
      throw err
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: loadProjects
  }
}