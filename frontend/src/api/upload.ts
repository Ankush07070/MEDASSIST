import api from "./axios";

export const uploadReport = async (
    file: File,
) => {

    const formData = new FormData();

    formData.append(
        "file",
        file,
    );

    const response = await api.post(
        "/reports/upload",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        },
    );

    return response.data;

};