import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminLogin = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const notify = (message) => toast(message);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // const data = { email, password };
    const data = {
      email: email,
      password: password,
      role: 'installation'
    };

    try {
      const response = await axios.post(
        "https://icutw3djvd.execute-api.ap-south-1.amazonaws.com/Prod/midas_login",
        data
      );

      console.log('Login Response', response);

      if (response.data["body-json"].statusCode === 200) {
        notify("Login Successfully");

        const token = response.data["body-json"].body.token;
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);

        console.log("Decoded token:", decoded);
        console.log("email from token:", decoded.email);
        console.log("emplyeeId from token:", decoded.employeeId);

        localStorage.setItem("adminEmail", decoded.email);
        localStorage.setItem("employeeId", decoded.employeeId);

        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);

        navigate("/");

      } else {
        notify(response.data["body-json"].body.message);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 p-6">
      <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-lg w-96 transition-all transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-md mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-white text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-transparent border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="block text-white text-sm font-semibold mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 bg-transparent border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70 transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="absolute right-3 top-9 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? "👁️" : "🙈"}
            </span>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-white/20 text-white py-2 rounded-lg font-semibold hover:bg-white/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;