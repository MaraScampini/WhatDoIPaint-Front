import axios from "axios";

const API_URL = import.meta.env.VITE_API_PROD_URL;

const headers = (token: string) => ({ headers: {
    Authorization: `Bearer ${token}`
}});

// LEVEL SELECTOR

export const getLevelOptions = async (token: string) => {
    try {
        let res = await axios.get(`${API_URL}/api/level/selector`, headers(token));
        return res.data;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}