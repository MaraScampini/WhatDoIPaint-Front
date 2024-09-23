import axios from "axios";

const API_URL = import.meta.env.VITE_API_PROD_URL;

// GET PROJECTS BY USER

export const getProjectsByUser = async (token: string) => {
    try {
        let res = await axios.get(`${API_URL}/api/project`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
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