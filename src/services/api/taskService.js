export const taskService = {
  // Get all tasks
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "assignee" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("task", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },
  
  // Get task by ID
  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "assignee" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "project_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById("task", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get tasks by project ID
  getByProjectId: async (projectId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "assignee" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("task", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  },
  
  // Create new task
  create: async (taskData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields for create operation
      const createData = {
        Name: taskData.Name || taskData.title || "New Task",
        Tags: taskData.Tags || "",
        Owner: taskData.Owner || null,
        title: taskData.title || "New Task",
        description: taskData.description || "",
        status: taskData.status || "To Do",
        priority: taskData.priority || "Medium",
        due_date: taskData.due_date || null,
        assignee: taskData.assignee || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: taskData.project_id || taskData.projectId || null
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await apperClient.createRecord("task", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to create task");
        }
      }
      
      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },
  
  // Update existing task
  update: async (id, taskData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id),
        ...(taskData.Name !== undefined && { Name: taskData.Name }),
        ...(taskData.Tags !== undefined && { Tags: taskData.Tags }),
        ...(taskData.Owner !== undefined && { Owner: taskData.Owner }),
        ...(taskData.title !== undefined && { title: taskData.title }),
        ...(taskData.description !== undefined && { description: taskData.description }),
        ...(taskData.status !== undefined && { status: taskData.status }),
        ...(taskData.priority !== undefined && { priority: taskData.priority }),
        ...(taskData.due_date !== undefined && { due_date: taskData.due_date }),
        ...(taskData.assignee !== undefined && { assignee: taskData.assignee }),
        ...(taskData.project_id !== undefined && { project_id: taskData.project_id }),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("task", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update task");
        }
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },
  
  // Delete task
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
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to delete task");
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
  
  // Add comment to task
  addComment: async (taskId, commentText) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const commentData = {
        Name: `Comment on Task ${taskId}`,
        text: commentText,
        author: "Current User", // This should be replaced with actual user info
        created_at: new Date().toISOString(),
        task_id: parseInt(taskId)
      };
      
      const params = {
        records: [commentData]
      };
      
      const response = await apperClient.createRecord("app_Comment", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to add comment");
        }
      }
      
      throw new Error("No result returned from comment creation");
    } catch (error) {
      console.error(`Error adding comment to task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Get comments for a task
  getComments: async (taskId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author" } },
          { field: { Name: "created_at" } },
          { field: { Name: "task_id" } }
        ],
        where: [
          {
            FieldName: "task_id",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("app_Comment", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Log activity for a task
  logActivity: async (taskId, type, description) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const activityData = {
        Name: `Activity for Task ${taskId}`,
        task_id: parseInt(taskId),
        type: type,
        description: description,
        user: "Current User", // This should be replaced with actual user info
        timestamp: new Date().toISOString()
      };
      
      const params = {
        records: [activityData]
      };
      
      const response = await apperClient.createRecord("app_Activity", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to log activity");
        }
      }
      
      throw new Error("No result returned from activity logging");
    } catch (error) {
      console.error(`Error logging activity for task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Get activities for a task
  getActivities: async (taskId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
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
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("app_Activity", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for task ${taskId}:`, error);
      throw error;
}
  }
};