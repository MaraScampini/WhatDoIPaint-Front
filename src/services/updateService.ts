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

// CREATE NEW UPDATE

interface UpdateData {
    projectId: string | number,
    images?: Array<string>,
    title?: string,
    description?: string,
    elements?: Array<SelectedElement>,
    squads?: Array<SelectedSquad>
}

interface SelectedElement {
    id: number,
    status: number
}

interface SelectedSquad {
    id: number,
    elements: Array<{
        amount: number,
        status: string,
        statusId: number
    }>
}

export const createUpdate = async (updateData: UpdateData) => {
    try {
        let res = await apiClient.post(`/api/update`, updateData);
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