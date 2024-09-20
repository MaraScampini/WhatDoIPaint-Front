import axios from "axios";

const API_URL = import.meta.env.VITE_API_PROD_URL;

// LOGIN

interface LoginCredentials {
    email: string,
    password: string
};

export const login = async (credentials : LoginCredentials) => {
    try {
        let res = await axios.post(`${API_URL}/api/login`, credentials);
        return res.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Unknown error');
        }
    }
}

// REGISTER

interface UserData {
    username: string,
    email: string,
    password: string
}

export const register = async (userData : UserData) => {
    try {
        let res = await axios.post(`${API_URL}/auth/register`, userData);
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