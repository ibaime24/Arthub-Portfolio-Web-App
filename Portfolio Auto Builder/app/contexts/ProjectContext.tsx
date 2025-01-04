'use client'

import { createContext, useContext, useState } from 'react'

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])

  const updateProject = (id, updates) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    )
  }

  return (
    <ProjectContext.Provider value={{ projects, updateProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  return useContext(ProjectContext)
}

