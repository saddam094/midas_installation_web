import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/header.js";
import Dashboard from "./pages/dashboard/dashboard.js";
import ParticularCategry from "./pages/particular_category/particular_category.js";
import ParticularJob from "./pages/particular_job/particular_job.js";
import Profile from "./pages/profile/profile.js";
import AdminLogin from "./admin_login.js";


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return localStorage.getItem("isAuthenticated") === "true";
    });


    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated);
      }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}

      {/* {isAuthenticated && (
        <div className="flex h-16 items-center px-10 border-b-2 bg-slate-100 border-slate-300 justify-between">
          <nav>
            <ul className="flex space-x-10">
              <NavLink to="/">Dashboard</NavLink>
            </ul>
          </nav>
        </div>
      )} */}

<Routes>
        <Route
          path="/admin_login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />}
        />

        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/particular_category" element={<ParticularCategry />} />
            <Route path="/particular_job" element={<ParticularJob />} />   
            <Route path="/profile" element={<Profile />} />    
          </>
        ) : (
          <Route path="*" element={<Navigate to="/admin_login" replace />} />
        )}
      </Routes>

    </Router>
  );
}

export default App;
