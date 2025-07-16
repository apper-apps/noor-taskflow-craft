import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];
let comments = [];
let activities = [];
let nextCommentId = 1;
let nextActivityId = 1;

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
    
    // Log creation activity
    await taskService.logActivity(newTask.Id, "created", `Task "${newTask.title}" was created`);
    
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

  // Comment management
  addComment: async (taskId, commentText) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newComment = {
      Id: nextCommentId++,
      taskId: parseInt(taskId),
      text: commentText,
      author: "Current User", // In a real app, this would be from auth context
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    
    // Log comment activity
    await taskService.logActivity(taskId, "comment", `Added a comment: "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"`);
    
    return { ...newComment };
  },

  getComments: async (taskId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return comments
      .filter(c => c.taskId === parseInt(taskId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(c => ({ ...c }));
  },

  deleteComment: async (commentId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = comments.findIndex(c => c.Id === parseInt(commentId));
    if (index !== -1) {
      comments.splice(index, 1);
      return true;
    }
    return false;
  },

  // Activity logging
  logActivity: async (taskId, type, description, user = "Current User") => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const activity = {
      Id: nextActivityId++,
      taskId: parseInt(taskId),
      type,
      description,
      user,
      timestamp: new Date().toISOString(),
    };
    activities.push(activity);
    return { ...activity };
  },

  getActivities: async (taskId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities
      .filter(a => a.taskId === parseInt(taskId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(a => ({ ...a }));
  },
};