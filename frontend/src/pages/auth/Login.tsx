import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const auth = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (
        e: React.FormEvent,
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await login({
                email,
                password,
            });

            auth.login(
                response.access_token,
            );

            navigate("/dashboard");

        } catch (error: any) {

            console.log(error);

            console.log(error.response);

            console.log(error.response?.data);

            alert(
                error.response?.data?.detail ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-xl w-[420px]"
            >

                <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">

                    MEDASSIST Login

                </h1>

                <Input
                    label="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <Button
                    type="submit"
                >

                    {loading
                        ? "Logging in..."
                        : "Login"}

                </Button>

            </form>

        </div>

    );

}

export default Login;