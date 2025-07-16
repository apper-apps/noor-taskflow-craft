import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

export const taskService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  getByProjectId: async (projectId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...taskData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString(),
      };
      return { ...tasks[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  },
};