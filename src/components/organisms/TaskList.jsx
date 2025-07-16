import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import StatusPill from "@/components/molecules/StatusPill";
import Avatar from "@/components/atoms/Avatar";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const TaskList = ({ tasks, onTaskClick, onTaskUpdate, onTaskDelete, className }) => {
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [taskComments, setTaskComments] = useState({});
  const [taskActivities, setTaskActivities] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

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

  const toggleTaskExpansion = async (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
      // Load comments and activities when expanding
      if (!taskComments[taskId] && !loadingComments[taskId]) {
        setLoadingComments(prev => ({ ...prev, [taskId]: true }));
        try {
          const { taskService } = await import("@/services/api/taskService");
          const [comments, activities] = await Promise.all([
            taskService.getComments(taskId),
            taskService.getActivities(taskId)
          ]);
          setTaskComments(prev => ({ ...prev, [taskId]: comments }));
          setTaskActivities(prev => ({ ...prev, [taskId]: activities }));
        } catch (error) {
          console.error("Failed to load task details:", error);
        } finally {
          setLoadingComments(prev => ({ ...prev, [taskId]: false }));
        }
      }
    }
    setExpandedTasks(newExpanded);
  };

  const handleAddComment = async (taskId, commentText) => {
    if (!commentText.trim()) return;
    
    try {
      const { taskService } = await import("@/services/api/taskService");
      const newComment = await taskService.addComment(taskId, commentText);
      setTaskComments(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), newComment]
      }));
    } catch (error) {
      console.error("Failed to add comment:", error);
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
    <div
    className={cn("bg-white rounded-lg shadow-card border border-gray-200", className)}>
    {/* Header */}
    <div
        className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
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
        {sortedTasks.map((task, index) => <div key={task.Id}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    delay: index * 0.05
                }}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onTaskClick(task)}>
                <div className="col-span-4">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 hover:bg-gray-200"
                                onClick={e => {
                                    e.stopPropagation();
                                    toggleTaskExpansion(task.Id);
                                }}>
                                <ApperIcon
                                    name={expandedTasks.has(task.Id) ? "ChevronDown" : "ChevronRight"}
                                    className="h-4 w-4" />
                            </Button>
                        </div>
                        {task.description && <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>}
                    </div>
                </div>
                <div className="col-span-2 flex items-center">
                    <StatusPill status={task.status} />
                </div>
                <div className="col-span-2 flex items-center">
                    <PriorityBadge priority={task.priority} />
                </div>
                <div className="col-span-2 flex items-center">
                    {task.dueDate ? <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                        <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                    </div> : <span className="text-sm text-gray-400">No due date</span>}
                </div>
                <div className="col-span-1 flex items-center">
                    {task.assignee ? <Avatar name={task.assignee} size="sm" /> : <div
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="h-4 w-4 text-gray-400" />
                    </div>}
                </div>
                <div className="col-span-1 flex items-center">
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={e => {
                                e.stopPropagation();
                                onTaskClick(task);
                            }}>
                            <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-red-600 hover:text-red-700"
                            onClick={e => {
                                e.stopPropagation();
                                onTaskDelete(task.Id);
                            }}>
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
            {/* Expanded Task Details */}
            <AnimatePresence>
                {expandedTasks.has(task.Id) && <motion.div
                    initial={{
                        opacity: 0,
                        height: 0
                    }}
                    animate={{
                        opacity: 1,
                        height: "auto"
                    }}
                    exit={{
                        opacity: 0,
                        height: 0
                    }}
                    className="bg-gray-50 border-t border-gray-200">
                    <div className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Comments Section */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <ApperIcon name="MessageCircle" className="h-5 w-5 text-indigo-600" />
                                    <h4 className="font-medium text-gray-900">Comments</h4>
                                </div>
                                <TaskCommentThread
                                    taskId={task.Id}
                                    comments={taskComments[task.Id] || []}
                                    onAddComment={handleAddComment}
                                    loading={loadingComments[task.Id]} />
                            </div>
                            {/* Activity Log */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <ApperIcon name="Activity" className="h-5 w-5 text-indigo-600" />
                                    <h4 className="font-medium text-gray-900">Activity Log</h4>
                                </div>
                                <TaskActivityLog
                                    activities={taskActivities[task.Id] || []}
                                    loading={loadingComments[task.Id]} />
                            </div>
                        </div>
                    </div>
                </motion.div>}
            </AnimatePresence>
        </div>)}
    </div>
    {tasks.length === 0 && <div className="text-center py-12">
        <ApperIcon name="CheckSquare" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Create your first task to get started.</p>
    </div>}
</div>
  );
};

export default TaskList;

// Task Comment Thread Component
const TaskCommentThread = ({ taskId, comments, onAddComment, loading }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(taskId, newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
    {/* Comment Form */}
    <form onSubmit={handleSubmit} className="space-y-2">
        <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="text-sm" />
        <div className="flex justify-end">
            <Button
                type="submit"
                size="sm"
                disabled={!newComment.trim() || isSubmitting}
                className="text-xs">
                {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
        </div>
    </form>
    {/* Comments List */}
    <div className="space-y-3 max-h-60 overflow-y-auto">
        {loading ? <div className="text-center py-4">
            <div
                className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
        </div> : comments.length === 0 ? <div className="text-center py-4 text-gray-500 text-sm">No comments yet. Be the first to comment!
                      </div> : comments.map(comment => <div
            key={comment.Id}
            className="flex space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <Avatar name={comment.author} size="sm" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
            </div>
        </div>)}
    </div>
</div>
  );
};

// Task Activity Log Component
const TaskActivityLog = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "status_change": return "ArrowRightCircle";
      case "assignee_change": return "UserCheck";
      case "priority_change": return "Flag";
      case "created": return "Plus";
      case "updated": return "Edit";
      default: return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "status_change": return "text-blue-600";
      case "assignee_change": return "text-green-600";
      case "priority_change": return "text-amber-600";
      case "created": return "text-indigo-600";
      case "updated": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          No activity recorded yet.
        </div>
      ) : (
        activities.map((activity) => (
          <div key={activity.Id} className="flex space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className={`flex-shrink-0 ${getActivityColor(activity.type)}`}>
              <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 text-sm">{activity.user}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};