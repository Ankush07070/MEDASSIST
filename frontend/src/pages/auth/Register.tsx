import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { register } from "../../api/auth";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async (
        e: React.FormEvent,
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            await register({
                full_name: fullName,
                email,
                password,
            });

            alert("Registration successful!");

            navigate("/login");

        } catch (error: any) {

            console.log("REGISTER PAGE ERROR");

            console.log(error);

            console.log(error.response);

            console.log(error.response?.data);

            alert(
                JSON.stringify(
                    error.response?.data,
                    null,
                    2,
                ),
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-xl shadow-xl w-[420px]"
            >

                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">

                    Create Account

                </h1>

                <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) =>
                        setFullName(e.target.value)
                    }
                />

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

                <Button type="submit">

                    {loading
                        ? "Creating Account..."
                        : "Register"}

                </Button>

            </form>

        </div>

    );

}

export default Register;