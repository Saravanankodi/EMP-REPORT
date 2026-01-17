import './App.css'
import UserPage from './pages/User'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
import LoginPage from './pages/LoginPage';
import Admin from './pages/Admin';
// import ProtectedRoute from "./components/ProtectedRoute";
// import type { ReactElement } from "react";



const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
  </div>
);
function App() {
  
  return (
    <>
    <section className="max-w-screen min-h-screen m-auto">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Layout (Employee + Admin) */}
        {/* <Route
          path="/*"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        > */}
          {/* Nested Routes inside Layout */}
          <Route path="/" element={<UserPage />} />

          {/* Admin Routes */}
          <Route path="admin" element={<Admin />} />
        {/* </Route> */}

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </section>    
    </>
  )
}

export default App
