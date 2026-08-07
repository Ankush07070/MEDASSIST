import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import Reports from "./pages/reports/Reports";
import Doctors from "./pages/doctors/Doctors";
import Appointments from "./pages/appointments/Appointments";
import BookAppointment from "./pages/appointments/BookAppointment";
import Hospitals from "./pages/hospitals/Hospitals";
import AIAssistantPage from "./pages/ai/AIAssistantPage";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ========================= */}
                {/* PUBLIC ROUTES              */}
                {/* ========================= */}

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

                {/* ========================= */}
                {/* PROTECTED ROUTES           */}
                {/* ========================= */}

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

                    <Route
                        path="/chat"
                        element={<AIAssistantPage />}
                    />

                    <Route
                        path="/appointments"
                        element={<Appointments />}
                    />

                    <Route
                        path="/appointments/book"
                        element={<BookAppointment />}
                    />

                    <Route
                        path="/doctors"
                        element={<Doctors />}
                    />

                    <Route
                        path="/hospitals"
                        element={<Hospitals />}
                    />

                </Route>

                {/* ========================= */}
                {/* FALLBACK                   */}
                {/* ========================= */}

                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App; 