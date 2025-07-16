import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/molecules/Modal";
import StatusPill from "@/components/molecules/StatusPill";
import ProgressRing from "@/components/molecules/ProgressRing";
import ProjectForm from "@/components/organisms/ProjectForm";
import SearchBar from "@/components/molecules/SearchBar";
import useProjects from "@/hooks/useProjects";
import useTasks from "@/hooks/useTasks";

const Projects = () => {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { projects, loading: projectsLoading, error: projectsError, loadProjects, createProject, updateProject, deleteProject } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();

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

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(projectId);
        toast.success("Project deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
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

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (projectsLoading || tasksLoading) {
    return <Loading variant="skeleton" />;
  }

  if (projectsError) {
    return (
      <Error
        title="Failed to load projects"
        message={projectsError}
        onRetry={loadProjects}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-gray-600 mt-1">Manage all your projects and track their progress.</p>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search projects..."
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
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={searchQuery || statusFilter !== "all" 
            ? "No projects match your filters" 
            : "No projects yet"
          }
          message={searchQuery || statusFilter !== "all"
            ? "Try adjusting your search or filters to find projects."
            : "Create your first project to get started with task management."
          }
          icon="Folder"
          actionLabel="Create Project"
          onAction={() => {
            setSelectedProject(null);
            setShowProjectModal(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const projectTasks = getProjectTasks(project.Id);
            const progress = getProjectProgress(project.Id);
            
            return (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <StatusPill status={project.status} />
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleEditProject(project)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProject(project.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/project/${project.Id}`)}
                  >
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
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

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

export default Projects;