import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button";
import { login } from "../services/authService";

const Login = () => {
    const initialUserCredentials = {
        email: "",
        password: ""
    }; 

    const [userCredentials, setUserCredentials] = useState(initialUserCredentials);
    const [error, setError] = useState<string|null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserCredentials(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const token = await login(userCredentials);
            setUserCredentials(initialUserCredentials);
            localStorage.setItem('authToken', token);
        } catch (error) {
            if(error instanceof Error) {
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
                <Input type="email" name="email" value={userCredentials.email} onChange={handleInputChange} />
                <Input type="password" name="password" value={userCredentials.password} onChange={handleInputChange} />

                <Button buttonType="submit" text="Login"/>
                {error && <p className="font-display text-red-300 mt-2">{error}</p>}
            </form>
            <p className="font-display text-sm uppercase pt-10">
                <span className="text-offWhite">Are you new? </span>
                <span className="text-lightTeal underline">Register</span>
            </p>
        </div>
    )
}

export default Login