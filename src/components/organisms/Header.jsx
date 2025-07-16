import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { cn } from "@/utils/cn";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Avatar from "@/components/atoms/Avatar";
const Header = ({ onMenuClick, searchValue, onSearchChange, className }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  return (
    <header className={cn("bg-white shadow-sm border-b border-gray-200", className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2 p-2"
              onClick={onMenuClick}
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center lg:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">Project Dashboard</h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar
              placeholder="Search projects, tasks..."
              value={searchValue}
              onChange={onSearchChange}
            />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={logout}
              title="Logout"
            >
              <ApperIcon name="LogOut" className="h-5 w-5" />
            </Button>
            
            <Avatar name={user?.firstName || "User"} size="md" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;