import './App.css'
import UserPage from './pages/User'
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoginPage from './pages/LoginPage';
import Admin from './pages/Admin';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth user:", currentUser);
  
      setUser(currentUser);
  
      if (!currentUser) {
        setRole('');
        return;
      }
  
      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
  
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      } catch (err) {
        console.error("Failed to fetch role:", err);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  return (
    <>
    <section className="max-w-screen min-h-screen m-auto">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="employee">
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </section>    
    </>
  )
}

export default App
