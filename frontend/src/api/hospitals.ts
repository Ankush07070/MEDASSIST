import api from "./axios";

export const getHospitals = async (
    city?: string,
    search?: string
) => {

    const response = await api.get("/hospitals", {
        params: {
            ...(city ? { city } : {}),
            ...(search ? { search } : {}),
        },
    });

    return response.data;

};

export const getHospital = async (
    hospitalId: string
) => {

    const response = await api.get(
        `/hospitals/${hospitalId}`
    );

    return response.data;

};