export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Invalid email format";
}

export const validatePassword = (password: string): string | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{4,12}$/;
    return passwordRegex.test(password) ? null : "Password must be 4 - 12 characters long and include uppercase, lowercase, number and symbol";
}

interface ProjectData {
    name: string;
    description?: string;
    level: number;
    brand: number;
    techniques?: number[];
    image?: string;
    priority: boolean;
}

interface formErrors {
    name?: string,
    level?: string,
    brand?: string
}
export const validateAddProjectForm = (formData: ProjectData): formErrors => {
    const errors: formErrors = {};
    if (formData.name === "") errors.name = "Name is required";
    if (formData.level === 0) errors.level = "Level is required";
    if (formData.brand === 0) errors.brand = "Brand is required";
    return errors;
}