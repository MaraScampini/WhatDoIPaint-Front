import axios from "axios";
import apiClient from "./apiClient";


// GET PROJECTS BY USER

export const getProjectsByUser = async () => {
    try {
        let res = await apiClient.get(`/api/project`);
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

export const togglePriority = async (userProjectId: number) => {
    try {
        let res = await apiClient.put(`/api/project/toggle/${userProjectId}`, {});
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

export const createProject = async (projectData: ProjectData) => {
    try {
        let res = await apiClient.post(`api/project`, projectData);
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

export const getProjectInfoById = async (projectId: string) => {

    let res = await apiClient.get(`/api/project/${projectId}`);
    return res.data;

}

// EDIT PROJECT

interface ProjectInfo {
    image?: string
}

export const editProject = async (projectInfo: ProjectInfo) => {
    let res = await apiClient.put(`/api/project`, projectInfo);
    return res.data;
}