import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // TEMPORARY: Bypass authentication for AI Studio Preview
  // since custom domains cannot be added in the Starter Tier
  const isPreviewBypass = true;

  if (!isPreviewBypass) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
