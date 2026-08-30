'use client'
import { useState, useEffect } from "react";
import type { Screen } from "./types";
import Welcome from "./app/patient/welcome/page";
import StaffRole from "./app/auth/login/page";
import DoctorLogin from "./app/auth/login/doctor/page";
import DoctorRequest from "./app/auth/request-access/doctor/page";
import NursingLogin from "./app/auth/login/nursing/page";
import NursingRequest from "./app/auth/request-access/nursing/page";
import AdminLogin from "./app/auth/login/admin/page";
import AdminRequest from "./app/auth/request-access/admin/page";
import ForgotPassword from "./app/auth/forgot-password/page";
import PasswordReset from "./app/auth/reset-password/page";
import AccessError from "./app/auth/access-denied/page";
import AuthSuccess from "./app/auth/handoff/page";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [meta, setMeta] = useState<Record<string, string>>({});
  const [key, setKey] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <div key={key} data-meta={JSON.stringify(meta)} className="min-h-full">
      {screen === "welcome" && <Welcome />}
      {screen === "staff-role" && <StaffRole />}
      {screen === "doctor-login" && <DoctorLogin />}
      {screen === "doctor-request" && <DoctorRequest />}
      {screen === "nursing-login" && <NursingLogin />}
      {screen === "nursing-request" && <NursingRequest />}
      {screen === "admin-login" && <AdminLogin />}
      {screen === "admin-request" && <AdminRequest />}
      {screen === "forgot-password" && <ForgotPassword />}
      {screen === "password-reset" && <PasswordReset />}
      {screen === "access-error" && <AccessError />}
      {screen === "auth-success" && <AuthSuccess />}
    </div>
  );
}
