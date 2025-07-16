import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

const useTasks = (projectId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = projectId 
        ? await taskService.getByProjectId(projectId)
        : await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to create task");
    }
  };

const updateTask = async (id, taskData) => {
    try {
      const currentTask = tasks.find(t => t.Id === parseInt(id));
      const updatedTask = await taskService.update(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.Id === parseInt(id) ? updatedTask : t));
        
        // Log activity for changes
        if (currentTask) {
          const changes = [];
          if (currentTask.status !== updatedTask.status) {
            changes.push({
              type: "status_change",
              description: `Status changed from "${currentTask.status}" to "${updatedTask.status}"`
            });
          }
          if (currentTask.assignee !== updatedTask.assignee) {
            changes.push({
              type: "assignee_change",
              description: `Assignee changed from "${currentTask.assignee || 'Unassigned'}" to "${updatedTask.assignee || 'Unassigned'}"`
            });
          }
          if (currentTask.priority !== updatedTask.priority) {
            changes.push({
              type: "priority_change",
              description: `Priority changed from "${currentTask.priority}" to "${updatedTask.priority}"`
            });
          }
          
          // Log each change
          for (const change of changes) {
            await taskService.logActivity(id, change.type, change.description);
          }
        }
        
        return updatedTask;
      }
      throw new Error("Task not found");
    } catch (err) {
      throw new Error(err.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

const addComment = async (taskId, commentText) => {
    try {
      const comment = await taskService.addComment(taskId, commentText);
      return comment;
    } catch (err) {
      throw new Error(err.message || "Failed to add comment");
    }
  };

  const getComments = async (taskId) => {
    try {
      const comments = await taskService.getComments(taskId);
      return comments;
    } catch (err) {
      throw new Error(err.message || "Failed to load comments");
    }
  };

  const getActivities = async (taskId) => {
    try {
      const activities = await taskService.getActivities(taskId);
      return activities;
    } catch (err) {
      throw new Error(err.message || "Failed to load activities");
    }
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    getComments,
    getActivities,
  };
};

export default useTasks;