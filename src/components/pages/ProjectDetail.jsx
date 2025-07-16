import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/molecules/Modal";
import ProjectOverview from "@/components/organisms/ProjectOverview";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import ProjectForm from "@/components/organisms/ProjectForm";
import { projectService } from "@/services/api/projectService";
import useTasks from "@/hooks/useTasks";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [view, setView] = useState("board");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { tasks, loading: tasksLoading, error: tasksError, loadTasks, createTask, updateTask, deleteTask } = useTasks(parseInt(id));

  useEffect(() => {
    const loadProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError("");
        const data = await projectService.getById(id);
        if (data) {
          setProject(data);
        } else {
          setProjectError("Project not found");
        }
      } catch (err) {
        setProjectError(err.message || "Failed to load project");
      } finally {
        setProjectLoading(false);
      }
    };

    loadProject();
  }, [id]);

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

  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(id, projectData);
      setProject(updatedProject);
      setShowProjectModal(false);
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (projectLoading) {
    return <Loading variant="skeleton" />;
  }

  if (projectError || !project) {
    return (
      <Error
        title="Project not found"
        message={projectError || "The project you're looking for doesn't exist."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (tasksLoading) {
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-4"
      >
        <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Project Overview */}
      <ProjectOverview
        project={project}
        tasks={tasks}
        onEditProject={() => setShowProjectModal(true)}
        onCreateTask={() => {
          setSelectedTask(null);
          setShowTaskModal(true);
        }}
      />

      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === "board" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setView("board")}
              className="rounded-md"
            >
              <ApperIcon name="Columns" className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button
              variant={view === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-md"
            >
              <ApperIcon name="List" className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <span className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>

      {/* Task Views */}
      {tasks.length === 0 ? (
        <Empty
          title="No tasks in this project"
          message="Add your first task to get started with project management."
          icon="CheckSquare"
          actionLabel="Add Task"
          onAction={() => {
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
        />
      ) : (
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {view === "board" ? (
            <KanbanBoard
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskClick={handleTaskClick}
            />
          ) : (
            <TaskList
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          )}
        </motion.div>
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
          projectId={parseInt(id)}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      </Modal>

      {/* Project Form Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          onCancel={() => setShowProjectModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetail;