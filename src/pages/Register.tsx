import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import useFormValidation from "../hooks/useFormValidation";
import { validateEmail, validatePassword } from "../services/validationService";
import { Link } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const initialUserData = {
    username: "",
    email: "",
    password: ""
  };

  const validationRules = {
    email: validateEmail,
    password: validatePassword
  };

  let { formValues, validationError, resetForm, handleInputChange, handleOnBlurValidation } = useFormValidation(initialUserData, validationRules);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (validationError.email || validationError.password) return;

    try {
      const res = await register(formValues);
      resetForm();
      setSuccess(res);
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
      <form onSubmit={handleSubmitRegister} className="w-1/4 flex flex-col items-center justify-center">

        <Input
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleInputChange}
          maxLength={40}
          onBlur={handleOnBlurValidation}
        />
        {validationError.username && <p className="font-display text-red-300 mt-2">{validationError.username}</p>}

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

        <Button buttonType="submit" text="Register" />
        {error && <p className="font-display text-red-300 mt-2">{error}</p>}
        {success &&
          <div className="flex flex-col items-center justify-center">
            <p className="font-display text-green-300 mt-2">{success}</p>
            <p>
              <Link to={'/login'}>
                <span className="font-display text-lightTeal underline font-semibold">Login </span>
              </Link>
              <span className="font-display text-offWhite">to continue</span>
            </p>
          </div>
        }
      </form>
      <p className="font-display text-sm uppercase pt-10">
        <span className="text-offWhite">Already have an account? </span>
        <Link to={'/login'}>
          <span className="text-lightTeal underline">Login</span>
        </Link>
      </p>
    </div>
  )
}

export default Register