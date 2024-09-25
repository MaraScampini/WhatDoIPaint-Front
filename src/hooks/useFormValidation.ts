import { useState } from "react"
import { MultiValue, SingleValue } from "react-select";

type ValidationRules<T> = {
    [K in keyof T]?: (value: string) => string | null;
}

interface Option {
    id: number;
    value: number;
    label: string;
}

const useFormValidation = <T extends { [key: string]: any }>(initialState: T, validationRules?: ValidationRules<T>) => {
    const [formValues, setFormValues] = useState<T>(initialState);
    const [validationError, setValidationError] = useState<Partial<{ [K in keyof T]: string | null }>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormValues(prevState => ({
                ...prevState,
                [name]: checked
            }))
        } else {
            setFormValues(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    const handleReactSelectChange = (name: keyof T) => (selectedOption: SingleValue<Option>) => {
        const value = selectedOption ? selectedOption.id : 0;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMultiSelectChange = (name: keyof T) => (selectedOptions: MultiValue<Option>) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormValues(prevState => ({
            ...prevState,
            [name]: values
        }));
    };

    const handleFile = (file: File, name: keyof T) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormValues(prevState => ({
                    ...prevState,
                    [name]: base64String // Update the image field
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageDrop = (name: keyof T) => (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0]; // Get the first file
        handleFile(file, name);
    };

    const handleFileSelect = (name: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the first selected file
        handleFile(file!, name);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDeleteImage = (event: React.MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();
        setFormValues(prevState => ({
            ...prevState,
            image: ""
        }));
        console.log('first')
    };

    const handleOnBlurValidation = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (validationRules![name as keyof T]) {
            const validationFunction = validationRules![name as keyof T];
            if (validationFunction) {
                const error = validationFunction(value);
                setValidationError(prevState => ({
                    ...prevState,
                    [name]: error
                }));
            }
        }
    }

    const resetForm = () => {
        setFormValues(initialState);
        setValidationError({});
    }

    return {
        formValues,
        validationError,
        resetForm,
        handleInputChange,
        handleOnBlurValidation,
        handleReactSelectChange,
        handleMultiSelectChange, 
        handleImageDrop,
        handleDragOver,
        handleFileSelect,
        handleDeleteImage
    };
};

export default useFormValidation;

