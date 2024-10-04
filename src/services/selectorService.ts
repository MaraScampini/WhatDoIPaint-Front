import axios from "axios";
import apiClient from "./apiClient";

// LEVEL SELECTOR

export const getLevelOptions = async () => {
    try {
        let res = await apiClient.get(`/api/level/selector`);
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

// BRAND SELECTOR

export const getBrandOptions = async () => {
    try {
        let res = await apiClient.get(`/api/brand/selector`);
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

// TECHNIQUES SELECTOR

export const getTechniquesOptions = async () => {
    try {
        let res = await apiClient.get(`/api/technique/selector`);
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