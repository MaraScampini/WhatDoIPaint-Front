import axios from "axios"
import { create } from "zustand"

interface User {
    username: string,
    email: string,
    roles: string[]
}

interface UserState {
    user: User | null,
    roles: string[] | null,
    fetchUser: (token: string) => Promise<void>,
    logout: () => void;
}

const API_URL = import.meta.env.VITE_API_PROD_URL;

const useUserStore = create<UserState>((set) => ({
    user: null,
    roles: null,
    fetchUser: async (token) => {
        const res = await axios.get(`${API_URL}/api/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data: User = res.data;
        set({ user: data, roles: data.roles })
        localStorage.setItem('user', JSON.stringify(data));
    },
    logout: () => {
        set({ user: null, roles: null });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
}))

export default useUserStore;