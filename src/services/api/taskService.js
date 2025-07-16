export const taskService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "assignee" } },
          { field: { Name: "project_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "assignee" } },
          { field: { Name: "project_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById("task", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  },

  getByProjectId: async (projectId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "assignee" } },
          { field: { Name: "project_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      throw error;
    }
  },

  create: async (taskData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: taskData.title || taskData.Name,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate || taskData.due_date,
          assignee: taskData.assignee,
          project_id: taskData.projectId || taskData.project_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create task");
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  update: async (id, taskData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title || taskData.Name,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate || taskData.due_date,
          assignee: taskData.assignee,
          project_id: taskData.projectId || taskData.project_id,
          updated_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update task");
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete task");
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // Comment management
  addComment: async (taskId, commentText) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Comment for Task ${taskId}`,
          text: commentText,
          author: "Current User",
          task_id: parseInt(taskId),
          created_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("app_Comment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  getComments: async (taskId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author" } },
          { field: { Name: "task_id" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "task_id",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords("app_Comment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Activity logging
  logActivity: async (taskId, type, description, user = "Current User") => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Activity for Task ${taskId}`,
          task_id: parseInt(taskId),
          type: type,
          description: description,
          user: user,
          timestamp: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("app_Activity", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error logging activity:", error);
      throw error;
    }
  },

  getActivities: async (taskId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "task_id" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "user" } },
          { field: { Name: "timestamp" } }
        ],
        where: [
          {
            FieldName: "task_id",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords("app_Activity", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  }
};