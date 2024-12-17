import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthRegister() {
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [isLoading, setIsLoading] = useState(false);

    const onsubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Registration successful:", result.message);
                navigate('/auth/login'); // Redirect to login page
            } else {
                console.error("Error:", result.message);
                // Optional: Show error message to the user
            }
        } catch (error) {
            console.error("Network error:", error);
            // Optional: Handle network error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-row w-full max-w-[450px]">
            <form
                method="POST"
                onSubmit={onsubmit} // Custom handler
                className="flex w-full border shadow-sm p-6 rounded-lg shadow-black flex-col space-y-3"
            >
                <h1 className="font-bold text-3xl text-center">Register</h1>

                {/* Name */}
                <div className="flex flex-col">
                    <label className="font-semibold text-sm" htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="p-3 border-slate-300 border rounded-lg w-full outline-none"
                        placeholder="Enter Your Name"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="font-semibold text-sm" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="p-3 border-slate-300 border rounded-lg w-full outline-none"
                        placeholder="Enter Your Email"
                        required
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label className="font-semibold text-sm" htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="p-3 border-slate-300 border rounded-lg w-full outline-none"
                        placeholder="Enter Your Password"
                        required
                    />
                </div>

                {/* Repeat Password */}
                <div className="flex flex-col">
                    <label className="font-semibold text-sm" htmlFor="repeatPassword">Repeat Password</label>
                    <input
                        type="password"
                        name="repeatPassword"
                        id="repeatPassword"
                        className="p-3 border-slate-300 border rounded-lg w-full outline-none"
                        placeholder="Re-enter Your Password"
                        required
                    />
                    {/* <p className="flex gap-1 pt-1 text-gray-500 text-sm font-bold flex-row"><input type="checkbox" className='cursor-pointer' />Show Password <p className='text-blue-800 pl-40 font-semibold'><a href="#">forget password</a></p></p> */}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="bg-blue-600 outline-none text-white font-bold p-3 rounded-lg w-full shadow-sm shadow-blue-800 border-slate-200 border"
                        disabled={isLoading} // Disable button when loading
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <p className="font-semibold mt-2">
                        Already have an account? <a href="/auth/login">Login</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default AuthRegister;
