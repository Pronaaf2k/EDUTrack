import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

export default function AuthSwitcher() {
  const [mode, setMode] = useState("login");
  return (
    <>
      {mode === "login" ? (
        <LoginPage onSwitchToSignUp={() => setMode("signup")} />
      ) : (
        <SignUpPage onSwitchToLogin={() => setMode("login")} />
      )}
    </>
  );
}