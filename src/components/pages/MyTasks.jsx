import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/molecules/Modal";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import SearchBar from "@/components/molecules/SearchBar";
import useTasks from "@/hooks/useTasks";
import useProjects from "@/hooks/useProjects";

const MyTasks = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { tasks, loading: tasksLoading, error: tasksError, loadTasks, createTask, updateTask, deleteTask } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowTaskModal(false);
      toast.success("Task created successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(selectedTask.Id, taskData);
      setShowTaskModal(false);
      setSelectedTask(null);
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await updateTask(taskId, updates);
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

// Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get task counts for each status
  const getTaskCounts = () => {
    return {
      all: tasks.length,
      "To Do": tasks.filter(t => t.status === "To Do").length,
      "In Progress": tasks.filter(t => t.status === "In Progress").length,
      "Done": tasks.filter(t => t.status === "Done").length,
    };
  };

  if (tasksLoading || projectsLoading) {
    return <Loading variant="skeleton" />;
  }

  if (tasksError) {
    return (
      <Error
        title="Failed to load tasks"
        message={tasksError}
        onRetry={loadTasks}
      />
    );
  }

  const taskCounts = getTaskCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Tasks</h1>
          <p className="text-gray-600 mt-1">Manage all your tasks across projects in one place.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
              <ApperIcon name="ListTodo" className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskCounts.all}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
              <ApperIcon name="Circle" className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">To Do</p>
              <p className="text-2xl font-bold text-gray-900">{taskCounts["To Do"]}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <ApperIcon name="Clock" className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{taskCounts["In Progress"]}</p>
            </div>
          </div>
        </motion.div>

<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-card p-6 border border-gray-200 cursor-pointer hover:shadow-card-hover hover:border-emerald-300 transition-all duration-200"
          onClick={() => setStatusFilter("Done")}
        >
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Done</p>
              <p className="text-2xl font-bold text-gray-900">{taskCounts["Done"]}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title={searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
            ? "No tasks match your filters" 
            : "No tasks yet"
          }
          message={searchQuery || statusFilter !== "all" || priorityFilter !== "all"
            ? "Try adjusting your search or filters to find tasks."
            : "Create your first task to get started with project management."
          }
          icon="CheckSquare"
          actionLabel="Create Task"
          onAction={() => {
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      )}

      {/* Task Form Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        title={selectedTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          task={selectedTask}
          projectId={projects.length > 0 ? projects[0].Id : null}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default MyTasks;