import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../conestans/baseUrl";
import { Stack } from "@mui/material";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { search } = useLocation();
    const navigate = useNavigate();

    const token = new URLSearchParams(search).get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${BASE_URL}/api/reset-password?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password }),
        });

        const data = await response.json();
        setMessage(data.message);

        if (response.ok) {
            setTimeout(() => navigate("/login"), 2000);
        }
    };

    return (
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </Stack>
    );
};

export default ResetPassword;