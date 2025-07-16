import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const ProjectForm = ({ project, onSubmit, onCancel, className }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "Planning",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    const projectData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (!project) {
      projectData.createdAt = new Date().toISOString();
    }

    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <FormField
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter project name"
        required
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter project description"
        rows={3}
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="Planning">Planning</option>
        <option value="Active">Active</option>
        <option value="On Hold">On Hold</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </FormField>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;