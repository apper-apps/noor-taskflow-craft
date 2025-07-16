import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import ProgressRing from "@/components/molecules/ProgressRing";

const ProjectOverview = ({ project, tasks, onEditProject, onCreateTask, className }) => {
  const completedTasks = tasks.filter(task => task.status === "Done").length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityStats = {
    high: tasks.filter(task => task.priority === "High").length,
    medium: tasks.filter(task => task.priority === "Medium").length,
    low: tasks.filter(task => task.priority === "Low").length,
  };

  return (
    <Card className={cn("p-6 bg-gradient-to-br from-white to-gray-50", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-3">{project.description}</p>
          <StatusPill status={project.status} />
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onEditProject}>
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <Button variant="primary" onClick={onCreateTask}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Progress Ring */}
        <div className="text-center">
          <ProgressRing progress={progress} size="lg" />
          <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
        </div>

        {/* Task Stats */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-sm text-gray-600">Tasks Completed</p>
        </div>

        {/* Priority Breakdown */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Priority Breakdown</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-600">High</span>
              <span className="font-medium">{priorityStats.high}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-600">Medium</span>
              <span className="font-medium">{priorityStats.medium}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-600">Low</span>
              <span className="font-medium">{priorityStats.low}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-emerald-500 mr-2" />
              <span>Task completed</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Plus" className="h-4 w-4 text-indigo-500 mr-2" />
              <span>New task added</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Clock" className="h-4 w-4 text-amber-500 mr-2" />
              <span>Due date updated</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectOverview;