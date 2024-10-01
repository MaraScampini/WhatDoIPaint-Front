import { create } from "zustand"
import { getMyInformation } from "../services/authService";
import { NavigateFunction } from "react-router-dom";

interface User {
    username: string,
    email: string,
    roles: string[]
}

interface UserState {
    user: User | null,
    roles: string[] | null,
    fetchUser: (token: string, navigate: NavigateFunction) => Promise<void>,
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    roles: null,
    fetchUser: async (token, navigate) => {
        try {
            const data: User = await getMyInformation(token);
            set({ user: data, roles: data.roles })
        } catch (error) {
            if(error instanceof Error) {
                set({user:null, roles:null});
                navigate('/');
            }
        }
    },
    logout: () => {
        set({ user: null, roles: null });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
}))

export default useUserStore;