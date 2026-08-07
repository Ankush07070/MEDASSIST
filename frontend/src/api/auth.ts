import api from "./axios";

export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const register = async (
    data: RegisterData,
) => {

    try {

        const response = await api.post(
            "/auth/register",
            data,
        );

        return response.data;

    } catch (error: any) {

        console.log("REGISTER ERROR");

        console.log(error);

        console.log(error.response);

        console.log(error.response?.data);

        throw error;

    }

};

export const login = async (
    data: LoginData,
) => {

    const formData = new URLSearchParams();

    formData.append(
        "username",
        data.email,
    );

    formData.append(
        "password",
        data.password,
    );

    const response = await api.post(
        "/auth/login",
        formData,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        },
    );

    return response.data;

};