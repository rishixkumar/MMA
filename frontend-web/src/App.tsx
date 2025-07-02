import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import { getFCMToken, messaging } from './services/firebase';
import { onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth check function
const isAuthenticated = () => !!localStorage.getItem('access_token');

// Protected Route wrapper
function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      toast.info(
        `${payload.notification?.title || "Notification"}: ${payload.notification?.body || ""}`
      );
    });
    return unsubscribe;
  }, []);

  const handleGetToken = async () => {
    const token = await getFCMToken();
    console.log('FCM Token:', token);
    alert('FCM Token: ' + token);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1>MMA Frontend Test</h1>
      <button onClick={handleGetToken}>Get FCM Token</button>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Default route */}
          <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
