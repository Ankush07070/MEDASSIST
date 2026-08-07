import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Reports from "./pages/reports/Reports";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Routes */}

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                </Route>

                {/* 404 Page */}

                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-slate-100">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-blue-600">
                                    404
                                </h1>

                                <p className="text-slate-600 mt-4 text-lg">
                                    Page Not Found
                                </p>
                            </div>
                        </div>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;