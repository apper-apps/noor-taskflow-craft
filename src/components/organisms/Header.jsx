import React, { useContext, useState, useEffect, useRef } from "react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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
            
            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar name={user?.firstName || "User"} size="md" />
              </Button>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Help functionality - could open help modal or navigate to help page
                      alert('Help functionality - This would typically open a help center or documentation');
                    }}
                  >
                    <ApperIcon name="HelpCircle" className="h-4 w-4 mr-3" />
                    Help
                  </button>
                  
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Settings functionality - could open settings modal or navigate to settings page
                      alert('Settings functionality - This would typically open application settings');
                    }}
                  >
                    <ApperIcon name="Settings" className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                  >
                    <ApperIcon name="LogOut" className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;