import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Avatar from "@/components/atoms/Avatar";
import { format } from "date-fns";

const TaskList = ({ tasks, onTaskClick, onTaskUpdate, onTaskDelete, className }) => {
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "priority") {
      const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
      aValue = priorityOrder[a.priority] || 0;
      bValue = priorityOrder[b.priority] || 0;
    }

    if (sortBy === "dueDate") {
      aValue = new Date(a.dueDate || "2099-12-31");
      bValue = new Date(b.dueDate || "2099-12-31");
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const SortButton = ({ column, children }) => (
    <Button
      variant="ghost"
      size="sm"
      className="justify-start font-medium text-gray-900 hover:text-indigo-600"
      onClick={() => handleSort(column)}
    >
      {children}
      <ApperIcon 
        name={sortBy === column ? (sortOrder === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"}
        className="h-4 w-4 ml-1"
      />
    </Button>
  );

  return (
    <div className={cn("bg-white rounded-lg shadow-card border border-gray-200", className)}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
        <div className="col-span-4">
          <SortButton column="title">Task</SortButton>
        </div>
        <div className="col-span-2">
          <SortButton column="status">Status</SortButton>
        </div>
        <div className="col-span-2">
          <SortButton column="priority">Priority</SortButton>
        </div>
        <div className="col-span-2">
          <SortButton column="dueDate">Due Date</SortButton>
        </div>
        <div className="col-span-1">
          <span className="text-sm font-medium text-gray-900">Assignee</span>
        </div>
        <div className="col-span-1">
          <span className="text-sm font-medium text-gray-900">Actions</span>
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-gray-200">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onTaskClick(task)}
          >
            <div className="col-span-4">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                )}
              </div>
            </div>
            
            <div className="col-span-2 flex items-center">
              <StatusPill status={task.status} />
            </div>
            
            <div className="col-span-2 flex items-center">
              <PriorityBadge priority={task.priority} />
            </div>
            
            <div className="col-span-2 flex items-center">
              {task.dueDate ? (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                  <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">No due date</span>
              )}
            </div>
            
            <div className="col-span-1 flex items-center">
              {task.assignee ? (
                <Avatar name={task.assignee} size="sm" />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="col-span-1 flex items-center">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task);
                  }}
                >
                  <ApperIcon name="Edit" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskDelete(task.Id);
                  }}
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="CheckSquare" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">Create your first task to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;