import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Avatar from "@/components/atoms/Avatar";
import { format } from "date-fns";

const KanbanBoard = ({ tasks, onTaskUpdate, onTaskClick, className }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dropZone, setDropZone] = useState(null);

  const columns = [
    { id: "To Do", title: "To Do", color: "bg-gray-100", count: 0 },
    { id: "In Progress", title: "In Progress", color: "bg-blue-100", count: 0 },
    { id: "Done", title: "Done", color: "bg-emerald-100", count: 0 },
  ];

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    const status = task.status || "To Do";
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {});

  // Update column counts
  columns.forEach(column => {
    column.count = tasksByStatus[column.id]?.length || 0;
  });

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedTask(null);
    setDropZone(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDropZone(columnId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropZone(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDropZone(null);
    
    if (draggedTask && draggedTask.status !== columnId) {
      onTaskUpdate(draggedTask.Id, { status: columnId });
    }
  };

  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="mb-3"
    >
      <Card
        className={cn(
          "p-4 cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-all duration-200",
          task.priority === "High" && "border-l-4 border-red-500",
          task.priority === "Medium" && "border-l-4 border-amber-500",
          task.priority === "Low" && "border-l-4 border-emerald-500"
        )}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        onClick={() => onTaskClick(task)}
      >
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <PriorityBadge priority={task.priority} />
            {task.assignee && (
              <Avatar name={task.assignee} size="sm" />
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn("w-3 h-3 rounded-full mr-2", column.color)}></div>
              <h2 className="font-medium text-gray-900">{column.title}</h2>
              <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {column.count}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "min-h-[500px] bg-gray-50 rounded-lg p-4 transition-all duration-200",
              dropZone === column.id && "bg-indigo-50 border-2 border-dashed border-indigo-300"
            )}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <AnimatePresence>
              {tasksByStatus[column.id]?.map((task) => (
                <TaskCard key={task.Id} task={task} />
              ))}
            </AnimatePresence>

            {(!tasksByStatus[column.id] || tasksByStatus[column.id].length === 0) && (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="text-center">
                  <ApperIcon name="Plus" className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Drop tasks here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;