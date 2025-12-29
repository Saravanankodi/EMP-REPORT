import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";

interface Props {
  user: User | null;
  role: string;
  allowedRole: string;
  children: ReactNode;
}

const ProtectedRoute = ({ user, role, allowedRole, children }: Props) => {
  if (!user) return <Navigate to="/" />;
  if (role !== allowedRole) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
