import axios from "axios";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_PROD_URL;
const token = localStorage.getItem('authToken');


const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            const {logout} = useUserStore.getState();
            const navigate = useNavigate();

            logout();
            navigate('/login');
        }
        return Promise.reject(error);
    }
)

export default apiClient;