import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_PROD_URL;

// LOGIN

interface LoginCredentials {
    email: string,
    password: string
};

export const login = async (credentials: LoginCredentials) => {
    try {
        let res = await axios.post(`${API_URL}/api/login`, credentials);
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

// REGISTER

interface UserData {
    username: string,
    email: string,
    password: string
}

export const register = async (userData: UserData) => {
    try {
        let res = await axios.post(`${API_URL}/auth/register`, userData);
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

// ME

export const getMyInformation = async (token: string) => {
    try {
        const res = await axios.get(`${API_URL}/api/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        localStorage.setItem('user', JSON.stringify(res.data));

        return res.data
    } catch (error) {
        if(axios.isAxiosError(error) && error.response){
            if(error.response.status === 401){
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            }
        } else {
            throw new Error('Unknown error');
        }
    }
}