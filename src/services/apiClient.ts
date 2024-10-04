import axios from "axios";
import useUserStore from "../store/useUserStore";
import { NavigateFunction } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_PROD_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setInterceptor = (navigate: NavigateFunction) => {
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if(error.response?.status === 401) {
                const {logout} = useUserStore.getState();
                
                logout();
                navigate('/login');
            }
            return Promise.reject(error);
        }
    )
}


export default apiClient;