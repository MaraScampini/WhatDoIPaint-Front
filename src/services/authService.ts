import axios from "axios";
import apiClient from "./apiClient";


// LOGIN

interface LoginCredentials {
    email: string,
    password: string
};

export const login = async (credentials: LoginCredentials) => {
    try {
        let res = await apiClient.post(`/api/login`, credentials);
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
        let res = await apiClient.post(`/auth/register`, userData);
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

export const getMyInformation = async () => {
    try {
        const res = await apiClient.get(`/api/me`);
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