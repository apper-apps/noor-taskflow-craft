import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import useTasks from "@/hooks/useTasks";
import useProjects from "@/hooks/useProjects";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (tasksLoading || projectsLoading) {
    return <Loading variant="skeleton" />;
  }

  if (tasksError) {
    return (
      <Error
        title="Failed to load calendar"
        message={tasksError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage your task deadlines.</p>
        </div>
        <Button variant="primary" onClick={goToToday}>
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Calendar Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="p-2"
            >
              <ApperIcon name="ChevronLeft" className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="p-2"
            >
              <ApperIcon name="ChevronRight" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {tasks.filter(task => task.dueDate).length} scheduled tasks
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={cn(
                  "min-h-[120px] p-2 border border-gray-200 hover:bg-gray-50 transition-colors",
                  !isCurrentMonth && "text-gray-400 bg-gray-50",
                  isTodayDate && "bg-indigo-50 border-indigo-300"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isTodayDate && "text-indigo-700",
                    !isCurrentMonth && "text-gray-400"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.Id}
                      className={cn(
                        "text-xs p-1 rounded bg-white border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer",
                        task.priority === "High" && "border-l-2 border-l-red-500",
                        task.priority === "Medium" && "border-l-2 border-l-amber-500",
                        task.priority === "Low" && "border-l-2 border-l-emerald-500"
                      )}
                      title={`${task.title} - ${getProjectName(task.projectId)}`}
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {task.title}
                      </div>
                      <div className="text-gray-500 truncate">
                        {getProjectName(task.projectId)}
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {tasks
            .filter(task => task.dueDate && new Date(task.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 10)
            .map(task => (
              <div
                key={task.Id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    task.priority === "High" && "bg-red-500",
                    task.priority === "Medium" && "bg-amber-500",
                    task.priority === "Low" && "bg-emerald-500"
                  )}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{getProjectName(task.projectId)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PriorityBadge priority={task.priority} />
                  <div className="text-sm text-gray-500">
                    {format(new Date(task.dueDate), "MMM d")}
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {tasks.filter(task => task.dueDate && new Date(task.dueDate) >= new Date()).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No upcoming tasks with due dates.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Calendar;