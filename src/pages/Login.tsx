import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button";
import { login } from "../services/authService";
import PasswordInput from "../components/PasswordInput";
import useFormValidation from "../hooks/useFormValidation";
import { validateEmail, validatePassword } from "../services/validationService";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const Login = () => {
    const initialUserCredentials = {
        email: "",
        password: ""
    };

    const validationRules = {
        email: validateEmail,
        password: validatePassword
    }

    let { formValues, validationError, resetForm, handleInputChange, handleOnBlurValidation } = useFormValidation(initialUserCredentials, validationRules);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const handleSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (validationError.email || validationError.password) return;

        try {
            const token = await login(formValues);
            resetForm();
            localStorage.setItem('authToken', token);
            await fetchUser();
            navigate('/feed');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <div className='w-full flex-1 flex flex-col items-center justify-center'>
            <p className="font-display text-5xl text-offWhite uppercase">
                Welcome
            </p>
            <form onSubmit={handleSubmitLogin} className="w-1/4 flex flex-col items-center justify-center">
                <Input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    maxLength={40}
                    onBlur={handleOnBlurValidation}
                />
                {validationError.email && <p className="font-display text-red-300 mt-2">{validationError.email}</p>}

                <PasswordInput
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    maxLength={12}
                // onBlur={handleOnBlurValidation}
                />
                {validationError.password && <p className="font-display text-red-300 mt-2">{validationError.password}</p>}

                <Button buttonType="submit" text="Login" />
                {error && <p className="font-display text-red-300 mt-2">{error}</p>}
            </form>
            <p className="font-display text-sm uppercase pt-10">
                <span className="text-offWhite">Are you new? </span>
                <Link to={'/register'}>
                    <span className="text-lightTeal underline">Register</span>
                </Link>
            </p>
        </div>
    )
}

export default Login