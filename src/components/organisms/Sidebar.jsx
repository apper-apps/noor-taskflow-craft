import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [projects] = useState([
    { id: 1, name: "Website Redesign", status: "active" },
    { id: 2, name: "Mobile App", status: "planning" },
    { id: 3, name: "Marketing Campaign", status: "active" },
  ]);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "My Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
    { name: "Projects", href: "/projects", icon: "Folder" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold gradient-text">TaskFlow Pro</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={onClose}
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
              isActive 
                ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-l-4 border-indigo-500" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "mr-3 h-5 w-5 transition-colors",
                location.pathname === item.href ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"
              )} 
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Recent Projects */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Projects</h3>
        <div className="space-y-2">
          {projects.map((project) => (
            <NavLink
              key={project.id}
              to={`/project/${project.id}`}
              onClick={onClose}
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
              <span className="truncate">{project.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-40">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="relative w-64 bg-white shadow-lg border-r border-gray-200"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;