import axios from "axios";

const API_URL = import.meta.env.VITE_API_PROD_URL;

const headers = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

// GET PROJECTS BY USER

export const getProjectsByUser = async (token: string) => {
    try {
        let res = await axios.get(`${API_URL}/api/project`, headers(token));
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

// TOGGLE PROJECT PRIORITY

export const togglePriority = async (token: string, userProjectId: number) => {
    try {
        let res = await axios.put(`${API_URL}/api/project/toggle/${userProjectId}`, {}, headers(token));
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

// CREATE PROJECT

interface ProjectData {
    name: string;
    description?: string;
    level: number;
    brand: number;
    techniques?: number[];
    image?: string;
    priority: boolean;
}

export const createProject = async (token: string, projectData: ProjectData) => {
    try {
        let res = await axios.post(`${API_URL}/api/project`, projectData, headers(token));
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

// GET PROJECT INFO BY ID

export const getProjectInfoById = async (token: string, projectId: string) => {

    let res = await axios.get(`${API_URL}/api/project/${projectId}`, headers(token));
    return res.data;

}