import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { loginUser } from "../../store/auth-slice"; 

function AuthLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access Redux state
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(loginUser(formData)).unwrap(); // Dispatch login thunk
      console.log("Login result:", result);

      if (result.success) {
        // Redirect based on user role
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/shop/home");
        }
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-full max-w-[450px]">
      <form
        method="POST"
        onSubmit={onSubmit}
        className="flex w-full shadow-sm p-6 rounded-lg shadow-black flex-col space-y-3"
      >
        <h1 className="font-bold text-4xl text-center">Login</h1>
        {/* Email */}
        <div className="flex flex-col">
          <label className="font-semibold text-lg" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="p-3 border-slate-300 border rounded-lg w-full outline-none"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="font-semibold text-lg" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="p-3 border-slate-300 border rounded-lg w-full outline-none"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <div className="mb-2 text-sm font-semibold mt-1">
            <input type="checkbox" id="forgetPassword" />
            <label htmlFor="forgetPassword" className="ml-2">
              Forget password
            </label>
          </div>
        </div>

        {/* Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 w-full shadow-sm shadow-blue-800 border-slate-200 border"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
          <p className="font-semibold mt-2">
            Don't have an account? <a href="/auth/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default AuthLogin;
