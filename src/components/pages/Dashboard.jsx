import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatusPill from "@/components/molecules/StatusPill";
import ProgressRing from "@/components/molecules/ProgressRing";
import Modal from "@/components/molecules/Modal";
import ProjectForm from "@/components/organisms/ProjectForm";
import useProjects from "@/hooks/useProjects";
import useTasks from "@/hooks/useTasks";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const { projects, loading: projectsLoading, error: projectsError, loadProjects, createProject, updateProject } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      setShowProjectModal(false);
      toast.success("Project created successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      await updateProject(selectedProject.Id, projectData);
      setShowProjectModal(false);
      setSelectedProject(null);
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.status === "Done").length;
    return (completedTasks / projectTasks.length) * 100;
  };

  const getOverallStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Done").length;
    const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
    const todoTasks = tasks.filter(task => task.status === "To Do").length;
    
    return { totalTasks, completedTasks, inProgressTasks, todoTasks };
  };

  if (projectsLoading || tasksLoading) {
    return <Loading variant="skeleton" />;
  }

  if (projectsError || tasksError) {
    return (
      <Error
        title="Failed to load dashboard"
        message={projectsError || tasksError}
        onRetry={() => {
          loadProjects();
        }}
      />
    );
  }

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedProject(null);
            setShowProjectModal(true);
          }}
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <ApperIcon name="Folder" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                <ApperIcon name="Clock" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <ApperIcon name="ListTodo" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todoTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <Empty
            title="No projects yet"
            message="Create your first project to get started with task management."
            icon="Folder"
            actionLabel="Create Project"
            onAction={() => {
              setSelectedProject(null);
              setShowProjectModal(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const projectTasks = getProjectTasks(project.Id);
              const progress = getProjectProgress(project.Id);
              
              return (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="p-6 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/project/${project.Id}`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <StatusPill status={project.status} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project);
                        }}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <ProgressRing progress={progress} size="sm" showLabel={false} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {projectTasks.filter(t => t.status === "Done").length}/{projectTasks.length}
                          </p>
                          <p className="text-xs text-gray-500">Tasks Complete</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{Math.round(progress)}%</p>
                        <p className="text-xs text-gray-500">Progress</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedProject(null);
        }}
        title={selectedProject ? "Edit Project" : "Create New Project"}
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowProjectModal(false);
            setSelectedProject(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;