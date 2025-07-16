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
  const [view, setView] = useState('month'); // 'month' or 'week'
  const [timeframe, setTimeframe] = useState('all'); // 'today', 'week', 'month', 'all'
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Week view calculations
  const getWeekStart = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const getWeekDays = (date) => {
    const weekStart = getWeekStart(new Date(date));
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(currentDate);

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

  const getProjectColor = (projectId) => {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500', 'bg-purple-500'];
    return colors[projectId % colors.length];
  };

  const filterTasksByTimeframe = (tasks) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = getWeekStart(new Date(now));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return tasks.filter(task => {
      if (!task.dueDate) return timeframe === 'all';
      const taskDate = new Date(task.dueDate);
      
      switch (timeframe) {
        case 'today':
          return isSameDay(taskDate, today);
        case 'week':
          return taskDate >= weekStart && taskDate <= weekEnd;
        case 'month':
          return taskDate >= monthStart && taskDate <= monthEnd;
        default:
          return true;
      }
    });
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
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
              {view === 'month' ? format(currentDate, "MMMM yyyy") : 
               `Week of ${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`}
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
          
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={view === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
                className="px-3 py-1 text-sm"
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className="px-3 py-1 text-sm"
              >
                Week
              </Button>
            </div>

            {/* Timeframe Filter */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Tasks</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <div className="text-sm text-gray-500">
              {filterTasksByTimeframe(tasks).length} tasks
            </div>
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
          {(view === 'month' ? calendarDays : weekDays).map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = view === 'month' ? isSameMonth(day, currentDate) : true;
            const isTodayDate = isToday(day);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={cn(
                  view === 'month' ? "min-h-[120px]" : "min-h-[160px]",
                  "p-2 border border-gray-200 hover:bg-gray-50 transition-colors",
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
                    {format(day, view === 'week' ? "EEE d" : "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, view === 'week' ? 5 : 3).map(task => (
                    <div
                      key={task.Id}
                      className={cn(
                        "text-xs p-1 rounded bg-white border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer relative",
                        task.priority === "High" && "border-l-2 border-l-red-500",
                        task.priority === "Medium" && "border-l-2 border-l-amber-500",
                        task.priority === "Low" && "border-l-2 border-l-emerald-500"
                      )}
                      title={`${task.title} - ${getProjectName(task.projectId)}`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          getProjectColor(task.projectId)
                        )}></div>
                        <div className="font-medium text-gray-900 truncate flex-1">
                          {task.title}
                        </div>
                      </div>
                      {view === 'week' && (
                        <div className="text-gray-500 truncate mt-1">
                          {getProjectName(task.projectId)}
                        </div>
                      )}
                    </div>
                  ))}
                  {dayTasks.length > (view === 'week' ? 5 : 3) && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayTasks.length - (view === 'week' ? 5 : 3)} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

{/* Filtered Tasks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {timeframe === 'today' ? 'Today\'s Tasks' : 
           timeframe === 'week' ? 'This Week\'s Tasks' :
           timeframe === 'month' ? 'This Month\'s Tasks' : 'Upcoming Tasks'}
        </h3>
        <div className="space-y-3">
          {filterTasksByTimeframe(tasks)
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
                    "w-3 h-3 rounded-full",
                    getProjectColor(task.projectId)
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
        
{filterTasksByTimeframe(tasks).filter(task => task.dueDate && new Date(task.dueDate) >= new Date()).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No tasks found for the selected timeframe.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Calendar;