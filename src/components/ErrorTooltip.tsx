import { useEffect } from 'react'
import useErrorStore from '../store/useErrorStore'


const ErrorTooltip = () => {
    const { errorMessage, clearError } = useErrorStore();

    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => {
                clearError();
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [errorMessage])

    if (!errorMessage) return null;

    return (
        <div className='fixed bottom-4 left-4 bg-red-400 bg-opacity-70 text-darkBg px-4 py-2 rounded-md shadow-lg z-50'>{errorMessage}</div>
    );
}

export default ErrorTooltip