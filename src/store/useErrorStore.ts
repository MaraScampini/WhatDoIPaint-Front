import { create } from "zustand";

interface ErrorStore {
    errorMessage: string,
    setError: (message: string) => void,
    clearError: () => void  
}

const useErrorStore = create<ErrorStore>((set) => ({
    errorMessage: '',
    setError: (message: string) => set({ errorMessage: message }),
    clearError: () => set({ errorMessage: '' })
}));

export default useErrorStore;