import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

export const projectService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projects];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = projects.find(p => p.Id === parseInt(id));
    return project ? { ...project } : null;
  },

  create: async (projectData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newProject = {
      ...projectData,
      Id: Math.max(...projects.map(p => p.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    return { ...newProject };
  },

  update: async (id, projectData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...projectData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString(),
      };
      return { ...projects[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      projects.splice(index, 1);
      return true;
    }
    return false;
  },
};