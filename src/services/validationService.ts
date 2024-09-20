export const validateEmail = (email:string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Invalid email format";
}

export const validatePassword = (password:string): string | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{4,12}$/;
    return passwordRegex.test(password) ? null : "Password must be 4 - 12 characters long and include uppercase, lowercase, number and symbol";
}