import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Team from "./pages/Team";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


import { loginSuccess, setLoading } from "./features/authSlice";
import { getAuthData, verifyToken } from "./utils/authHelper";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const loading = useSelector((state) => state.auth?.loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const loading = useSelector((state) => state.auth?.loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));

      const authData = getAuthData();

      if (authData) {
        try {
          const user = await verifyToken();

          if (user) {
            dispatch(loginSuccess(user));
          }
        } catch (error) {
          console.error("Token verification failed:", error);
        }
      }

      dispatch(setLoading(false));
      setInitialCheckDone(true);
    };

    checkAuth();
  }, [dispatch]);

  if (!initialCheckDone) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

       

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />

          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route
            path="projects/:projectId/analytics"
            element={<ProjectDetails />}
          />
          <Route
            path="projects/:projectId/calendar"
            element={<ProjectDetails />}
          />
          <Route
            path="projects/:projectId/settings"
            element={<ProjectDetails />}
          />

          <Route
            path="projects/:projectId/tasks/:taskId"
            element={<TaskDetails />}
          />

          <Route path="team" element={<Team />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
