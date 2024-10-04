import { create } from "zustand"
import { getMyInformation } from "../services/authService";

interface User {
    username: string,
    email: string,
    roles: string[]
}

interface UserState {
    user: User | null,
    roles: string[] | null,
    fetchUser: () => Promise<void>,
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    roles: null,
    fetchUser: async () => {
        const data: User = await getMyInformation();
        set({ user: data, roles: data.roles })
    },
    logout: () => {
        set({ user: null, roles: null });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
}))

export default useUserStore;