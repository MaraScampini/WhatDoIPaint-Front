import axios from "axios";
import apiClient from "./apiClient";

// GET UPDATE INFORMATION

export const getUpdateInfo = async (updateId: string) => {
    try {
        let res = await apiClient.get(`/api/update/${updateId}`);
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

// CREATE NEW SHORT UPDATE

export const createShortUpdate = async (projectId: number) => {
    try {
        let res = await apiClient.post(`/api/update/short/${projectId}`);
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