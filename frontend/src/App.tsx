'use client'
import { useState, useEffect } from "react";
import type { Screen } from "./types";
import Welcome from "./screens/Welcome";
import StaffRole from "./screens/StaffRole";
import DoctorLogin from "./screens/DoctorLogin";
import DoctorRequest from "./screens/DoctorRequest";
import NursingLogin from "./screens/NursingLogin";
import NursingRequest from "./screens/NursingRequest";
import AdminLogin from "./screens/AdminLogin";
import AdminRequest from "./screens/AdminRequest";
import ForgotPassword from "./screens/ForgotPassword";
import PasswordReset from "./screens/PasswordReset";
import AccessError from "./screens/AccessError";
import AuthSuccess from "./screens/AuthSuccess";
import PatientIntake from "./screens/PatientIntake";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [meta, setMeta] = useState<Record<string, string>>({});
  const [key, setKey] = useState(0);

  const navigate = (nextScreen: Screen, nextMeta?: Record<string, string>) => {
    setScreen(nextScreen);
    setMeta(nextMeta || {});
    setKey((k) => k + 1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  useEffect(() => {
    document.title = "Vaidya — Clinical Intelligence";
  }, []);

  const props = { onNavigate: navigate, meta };

  return (
    <div key={key} className="min-h-full">
      {screen === "welcome" && <Welcome onNavigate={navigate} />}
      {screen === "staff-role" && <StaffRole onNavigate={navigate} />}
      {screen === "doctor-login" && <DoctorLogin {...props} />}
      {screen === "doctor-request" && <DoctorRequest {...props} />}
      {screen === "nursing-login" && <NursingLogin {...props} />}
      {screen === "nursing-request" && <NursingRequest {...props} />}
      {screen === "admin-login" && <AdminLogin {...props} />}
      {screen === "admin-request" && <AdminRequest {...props} />}
      {screen === "forgot-password" && <ForgotPassword {...props} />}
      {screen === "password-reset" && <PasswordReset {...props} />}
      {screen === "access-error" && <AccessError {...props} />}
      {screen === "auth-success" && <AuthSuccess {...props} />}
      {screen === "patient-intake" && <PatientIntake {...props} />}
    </div>
  );
}
