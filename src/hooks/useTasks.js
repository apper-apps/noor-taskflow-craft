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
      const updatedTask = await taskService.update(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.Id === parseInt(id) ? updatedTask : t));
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

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

export default useTasks;