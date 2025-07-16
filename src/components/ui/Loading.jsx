import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "page" }) => {
  if (variant === "page") {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Project header skeleton */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 shimmer"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 shimmer"></div>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-2 shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 shimmer"></div>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-2 shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 shimmer"></div>
            </div>
          </div>
        </div>

        {/* Kanban board skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-4 border border-gray-200">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mb-4 shimmer"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full mb-2 shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-3 shimmer"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 shimmer"></div>
                      <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default Loading;