import React, { useState } from "react";

const BACKGROUND_URL =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80";

export default function SignUpPage({ onSwitchToLogin }) {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    studentId: "",
    teacherId: "",
    adminCode: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (role === "student" && !form.studentId) {
      alert("Please enter your Student ID.");
      return;
    }
    if (role === "teacher" && (!form.teacherId || !form.department)) {
      alert("Please enter Teacher ID and Department.");
      return;
    }
    if (role === "admin" && (!form.adminCode || !form.department)) {
      alert("Please enter Admin Code and Department.");
      return;
    }
    alert(
      `Sign-up successful!\nWelcome ${role.charAt(0).toUpperCase() + role.slice(1)}, ${form.username}!`
    );
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

      {/* Sign Up Glass Box */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full items-center justify-between px-4 md:px-32 py-16">
        {/* Sign Up form */}
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
            <form onSubmit={handleSignUp} className="space-y-7">
              <div>
                <label className="block text-white text-base font-medium mb-2 tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoFocus
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                  placeholder="Choose your username"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-base font-medium mb-2 tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-base font-medium mb-2 tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-base font-medium mb-2 tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              {/* Role-specific fields */}
              {role === "student" && (
                <div>
                  <label className="block text-white text-base font-medium mb-2 tracking-wide">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                    placeholder="Student ID"
                    required
                  />
                </div>
              )}
              {role === "teacher" && (
                <>
                  <div>
                    <label className="block text-white text-base font-medium mb-2 tracking-wide">
                      Teacher ID
                    </label>
                    <input
                      type="text"
                      name="teacherId"
                      value={form.teacherId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                      placeholder="Teacher ID"
                      required
                    />
                  </div>
                </>
              )}
              {role === "admin" && (
                <>
                  <div>
                    <label className="block text-white text-base font-medium mb-2 tracking-wide">
                      Admin ID
                    </label>
                    <input
                      type="text"
                      name="adminId"
                      value={form.adminCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded bg-transparent border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition text-lg"
                      placeholder="Admin Id"
                      required
                    />
                  </div>
          
                </>
              )}
              <div className="flex items-center justify-between text-sm mt-2">
                <button
                  type="button"
                  className="text-white/80 hover:underline transition"
                  onClick={onSwitchToLogin}
                  tabIndex={0}
                >
                  Already have an account? Login
                </button>
              </div>
              <button
                type="submit"
                className="mt-8 w-full py-3 bg-blue-800 hover:bg-blue-700 text-white text-lg font-bold rounded shadow-xl transition"
              >
                Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
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