import axios from "axios";

const API_URL = import.meta.env.VITE_API_PROD_URL;

const headers = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

// GET UPDATE INFORMATION

export const getUpdateInfo = async (token: string, updateId: string) => {
    try {
        let res = await axios.get(`${API_URL}/api/update/${updateId}`, headers(token));
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}