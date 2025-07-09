import React, { useState } from "react";

const BACKGROUND_URL =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80";

export default function LoginPage({ onSwitchToSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }
    alert(`Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)} ${username}!`);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-[Inter]">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${BACKGROUND_URL}')`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-blue-900 bg-opacity-80" />

      {/* Login Glass Box */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full items-center justify-between px-4 md:px-32 py-16">
        {/* Login form */}
        <div className="w-full max-w-md md:mr-12">
          <div className="rounded-xl bg-white/15 shadow-2xl backdrop-blur-sm p-8 md:p-10 border border-white/30">
            <h1 className="text-white text-4xl font-extrabold mb-2 text-center tracking-wide drop-shadow-lg select-none">
              EDUTrack
            </h1>
            {/* Role buttons */}
            <div className="flex justify-center gap-3 mb-8">
              {["student", "teacher", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`px-5 py-2 rounded-full font-semibold text-base transition border-2 
                    ${
                      role === r
                        ? "bg-blue-700 border-blue-300 text-white shadow"
                        : "bg-white/10 border-white/40 text-white hover:bg-blue-700/50"
                    }`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <form onSubmit={handleLogin} className="space-y-7">
              <div>
                <label className="block text-white text-base font-medium mb-2 tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-white text-base font-medium mb-2 tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <a
                  href="#"
                  className="text-white/80 hover:underline transition"
                  tabIndex={0}
                  onClick={e => {
                    e.preventDefault();
                    alert("Password reset not implemented.");
                  }}
                >
                  Forgot Password?
                </a>
                <button
                  type="button"
                  className="text-white/80 hover:underline transition"
                  onClick={onSwitchToSignUp}
                  tabIndex={0}
                >
                  Sign Up
                </button>
              </div>
              <button
                type="submit"
                className="mt-8 w-full py-3 bg-blue-800 hover:bg-blue-700 text-white text-lg font-bold rounded shadow-xl transition"
              >
                Login as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            </form>
          </div>
        </div>

        {/* Right-side heading/text */}
        <div className="hidden md:flex flex-col items-start justify-center flex-1 pl-10">
          <h1 className="text-white text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-lg leading-tight">
            NORTH SOUTH<br />
            UNIVERSITY
          </h1>
          <p className="text-white text-2xl lg:text-3xl font-medium drop-shadow mb-2">
            The leading private university <br />
            <span className="bg-white text-blue-900 font-extrabold px-3 py-0.5 rounded">
              certified
            </span>{" "}
            for excellence in higher-education.
          </p>
        </div>
      </div>
    </div>
  );
}