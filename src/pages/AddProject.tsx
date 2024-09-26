import Select from 'react-select';
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation";
import { reactSelectStyles } from "../utils/reactSelectStyles";
import { useEffect, useRef, useState } from "react";
import { getBrandOptions, getLevelOptions, getTechniquesOptions } from "../services/selectorService";
import Button from '../components/Button';
import useErrorStore from '../store/useErrorStore';
import { createProject } from '../services/projectService';
import { useNavigate } from 'react-router-dom';
import { validateAddProjectForm } from '../services/validationService';

// SELECTOR OPTIONS RECEIVED FROM THE API
interface Option {
    value: number;
    label: string;
    id: number;
}

// PROJECT DATA OBJECT TO SEND TO THE API
interface ProjectData {
    name: string;
    description?: string;
    level: number;
    brand: number;
    techniques?: number[];
    image?: string;
    priority: boolean;
}

// ERRORS OBJECT FORMED ON SUBMIT
interface formErrors {
    name?: string,
    level?: string,
    brand?: string
}

const AddProject = () => {
    // INITIAL DATA AND STATES
    const initialProjectData: ProjectData = {
        name: "",
        level: 0,
        brand: 0,
        priority: false
    };
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const [levelOptions, setLevelOptions] = useState<Option[]>([]);
    const [brandOptions, setBrandOptions] = useState<Option[]>([]);
    const [techniqueOptions, setTechniqueOptions] = useState<Option[]>([]);
    const [formErrors, setFormErrors] = useState<formErrors>({});

    // LOAD SELECTORS
    useEffect(() => {
        const loadSelectors = async () => {
            if (token) {
                const levels = await getLevelOptions(token);
                setLevelOptions(levels);
                const brands = await getBrandOptions(token);
                setBrandOptions(brands);
                const techniques = await getTechniquesOptions(token);
                setTechniqueOptions(techniques);
            }
        }
        loadSelectors();
    }, [])

    // HANDLE INPUT ELEMENT TO UPLOAD IMAGES CLICKING ON IT
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.value = "";
        }
    };

    let { formValues, handleInputChange, handleReactSelectChange, handleMultiSelectChange, handleImageDrop, handleDragOver, handleFileSelect, handleDeleteImage } = useFormValidation(initialProjectData);

    // HANDLE SUBMIT PROJECT AND CONTROL EVERYTHING IS CORRECT BEFORE
    const handleSubmitProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        const errors = validateAddProjectForm(formValues);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        try {
            await createProject(token!, formValues);
            navigate('/feed');
        } catch (error) {
            if (error instanceof Error) {
                useErrorStore.getState().setError(error.message);
            }
        }
    }

    return (
        <div className="text-offWhite flex flex-col ms-10 ml-10">
            <div className="font-display text-3xl font-semibold">New Project</div>
            <form onSubmit={handleSubmitProject} className="w-full flex flex-col">
                <div className='w-full flex flex-col'>
                    <div className='flex w-full justify-between'>
                        <div className='flex flex-col w-2/4'>
                            <div className="w-full">
                                <Input
                                    type="text"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {formErrors.name && <p className='text-red-400 text-sm font-display uppercase'>{formErrors.name}</p>}
                            <div className="w-full py-3">
                                <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                                <textarea
                                    className='font-display text-offWhite bg-darkGrey h-60 resize-none rounded-md px-5 py-3 mb-2 w-full'
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                    maxLength={1000}
                                />
                            </div>
                        </div>
                        <div className='flex justify-center w-full h-80'>
                            <div className='flex flex-col w-2/4'>
                                <p className="font-display text-lightTeal uppercase font-light">upload cover image</p>
                                <div
                                    className="mt-4 p-6 border-dashed border-2 border-lightTeal rounded-lg cursor-pointer h-80 flex items-center justify-center text-lightTeal hover:border-solid hover:text-offWhite"
                                    onDrop={handleImageDrop('image')}
                                    onDragOver={handleDragOver}
                                    onClick={handleClick}
                                >
                                    {formValues.image ? (
                                        <div className="mt-4">
                                            <img src={formValues.image} alt="Preview" className="max-h-40 object-contain" onClick={(e) => handleDeleteImage(e)} />
                                        </div>

                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                        </svg>

                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect('image')}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-center space-x-20">
                        <div className="w-1/5">
                            <p className="font-display text-lightTeal uppercase font-light pb-1">Level</p>
                            <Select
                                options={levelOptions}
                                onChange={handleReactSelectChange('level')}
                                value={levelOptions.find(option => option.id === formValues.level)}
                                unstyled
                                classNames={reactSelectStyles}
                                isClearable
                            />
                            {formErrors.level && <p className='text-red-400 text-sm font-display uppercase mt-2'>{formErrors.level}</p>}
                        </div>

                        <div className="w-1/5">
                            <p className="font-display text-lightTeal uppercase font-light pb-1">Brand</p>
                            <Select
                                options={brandOptions}
                                onChange={handleReactSelectChange('brand')}
                                value={brandOptions.find(option => option.id === formValues.brand)}
                                unstyled
                                classNames={reactSelectStyles}
                                isClearable
                            />
                            {formErrors.brand && <p className='text-red-400 text-sm font-display uppercase mt-2'>{formErrors.brand}</p>}
                        </div>

                        <div className="w-1/5">
                            <p className="font-display text-lightTeal uppercase font-light pb-1">Techniques</p>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={techniqueOptions}
                                onChange={handleMultiSelectChange('techniques')}
                                value={techniqueOptions.filter(option => formValues.techniques?.includes(option.id))}
                                unstyled
                                classNames={reactSelectStyles}
                            />
                        </div>

                    </div>
                </div>
                <div className="mt-10 flex flex-col justify-center items-center">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="priority"
                            checked={formValues.priority}
                            onChange={handleInputChange}
                            className="form-checkbox h-5 w-5 text-teal"
                        />
                        <span className="font-display text-lightTeal uppercase font-light">Mark this project as priority</span>
                    </label>
                    <Button buttonType='submit' text='save project' />
                </div>
            </form>
        </div >
    )
}

export default AddProject