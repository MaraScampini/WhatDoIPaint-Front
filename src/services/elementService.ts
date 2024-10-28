import axios from "axios";
import apiClient from "./apiClient"

// ADD ELEMENTS TO PROJECT

interface Line {
    name: string,
    amount: string
}

interface ElementsToSend {
    projectId: string | number,
    statuses: StatusesToSend
}

interface StatusesToSend {
    box: Array<Line>,
    sprue: Array<Line>,
    printed: Array<Line>,
    assembled: Array<Line>,
    primed: Array<Line>,
    halfPainted: Array<Line>,
    painted: Array<Line>,
    finished: Array<Line>
}

export const addElementsToProject = async (elementData: ElementsToSend) => {
    try {
        let res = await apiClient.post('/api/element', elementData);
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

// DELETE ELEMENT OR SQUAD

export const deleteElement = async (elementId: number) => {
    try {
        let res = await apiClient.delete(`/api/element/${elementId}`);
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

export const deleteSquad = async (squadId: number) => {
    try {
        let res = await apiClient.delete(`/api/squad/${squadId}`);
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