import api from "./axios";

export const getAppointments = async () => {

    const response = await api.get("/appointments/me");

    return response.data;

};