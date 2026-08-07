import api from "./axios";

export const getDoctors = async () => {

    const response = await api.get("/doctors");

    return response.data;

};