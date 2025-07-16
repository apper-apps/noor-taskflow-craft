import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import ProjectDetail from "@/components/pages/ProjectDetail";
import MyTasks from "@/components/pages/MyTasks";
import Projects from "@/components/pages/Projects";
import Calendar from "@/components/pages/Calendar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="project/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="projects" element={<Projects />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
    </div>
  );
}

export default App;