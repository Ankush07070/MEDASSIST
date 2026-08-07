import api from "./axios";


export const getAppointments = async () => {
    const response = await api.get("/appointments/me");
    return response.data;
};

export const bookAppointment = async (data: {
    doctor_id: string;
    appointment_time: string;
    reason: string;
}) => {
    const response = await api.post(
        "/appointments",
        data
    );

    return response.data;
};

export const cancelAppointment = async (
    appointmentId: string
) => {
    const response = await api.patch(
        `/appointments/${appointmentId}/cancel`
    );

    return response.data;
};