import Select from 'react-select';
import useFormValidation from "../hooks/useFormValidation";
import Input from "./Input";
import { useQueries } from '@tanstack/react-query';
import { getBrandOptions, getLevelOptions, getTechniquesOptions } from '../services/selectorService';
import useErrorStore from '../store/useErrorStore';
import { reactSelectStyles } from '../utils/reactSelectStyles';
import Button from './Button';
import { editProject } from '../services/projectService';
import { useState } from 'react';
import Loader from './Loader';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    projectId: number,
    projectData: {
        name: string,
        description: string,
    }
}

interface InitialEditData {
    projectId: number,
    name?: string,
    description?: string,
    brand?: number,
    level?: number,
    techniques?: number[]
}

interface Option {
    value: number;
    label: string;
    id: number;
}

const EditProjectPopup: React.FC<ModalProps> = ({ isOpen, onClose, projectId, projectData }) => {
    if (!isOpen) return null;

    const initialEditData: InitialEditData = {
        projectId: projectId,
        name: projectData.name,
        description: projectData.description
    }

    const setError = useErrorStore((state) => state.setError);
    const [isLoading, setIsLoading] = useState(false);

    const { formValues, handleInputChange, handleReactSelectChange, handleMultiSelectChange } = useFormValidation(initialEditData);

    const [{ data: levelOptions, error: errorLevels },
        { data: brandOptions, error: errorBrands },
        { data: techniqueOptions, error: errorTechniques }] = useQueries({
            queries: [
                {
                    queryKey: ['levelOptions'],
                    queryFn: () => getLevelOptions(),
                },
                {
                    queryKey: ['brandOptions'],
                    queryFn: () => getBrandOptions(),
                },
                {
                    queryKey: ['techniqueOptions'],
                    queryFn: () => getTechniquesOptions(),
                },
            ],
        }) as [{ data: Option[] | undefined, isLoading: boolean, error: unknown },
            { data: Option[] | undefined, isLoading: boolean, error: unknown },
            { data: Option[] | undefined, isLoading: boolean, error: unknown }];;

    [errorLevels, errorBrands, errorTechniques].map(error => {
        if (error instanceof Error) {
            setError(error?.message)
        }
    });

    const handleSubmitInfo = async () => {
        setIsLoading(true);
        await editProject(formValues);
        setIsLoading(false);
        onClose();
    }

    return (
        <div className="bg-darkBg bg-opacity-75 fixed inset-0 flex items-center justify-center z-40">
            {isLoading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="w-1/2 h-3/5 bg-darkBg border border-lightTeal rounded-md
                                flex flex-col items-center justify-center 
                                 text-offWhite font-display uppercase 
                                relative
                ">
                    <div className="absolute top-5 right-5 text-lightTeal hover:text-offWhite hover:cursor-pointer"
                        onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="w-full flex flex-col justify-center ps-12">
                        <form onSubmit={handleSubmitInfo}>
                            <div className="w-full flex justify-center text-2xl">Edit project</div>
                            <div>
                                <div className="w-full pe-12">
                                    <Input
                                        type="text"
                                        value={formValues.name || ""}
                                        name="name"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="py-3 pe-12 w-full">
                                    <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                                    <textarea
                                        className="font-display text-offWhite bg-darkGrey h-40 resize-none rounded-md px-5 py-3 mb-2 w-full"
                                        name="description"
                                        value={formValues.description || ""}
                                        onChange={handleInputChange}
                                        maxLength={1000}
                                    />
                                </div>
                                <div className="flex gap-x-4 pe-12">

                                    <div className='w-1/3'>
                                        <p className="font-display text-lightTeal uppercase font-light pb-1">Level</p>

                                        <Select
                                            options={levelOptions}
                                            onChange={handleReactSelectChange('level')}
                                            value={levelOptions?.find(option => option.id === formValues.level)}
                                            unstyled
                                            classNames={reactSelectStyles}
                                            isClearable
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <p className="font-display text-lightTeal uppercase font-light pb-1">Brand</p>
                                        <Select
                                            options={brandOptions}
                                            onChange={handleReactSelectChange('brand')}
                                            value={brandOptions?.find(option => option.id === formValues.brand)}
                                            unstyled
                                            classNames={reactSelectStyles}
                                            isClearable
                                        />
                                    </div>
                                    <div className='w-1/3'>
                                        <p className="font-display text-lightTeal uppercase font-light pb-1">Techniques</p>
                                        <Select
                                            isMulti
                                            closeMenuOnSelect={false}
                                            options={techniqueOptions}
                                            onChange={handleMultiSelectChange('techniques')}
                                            value={techniqueOptions?.filter(option => formValues.techniques?.includes(option.id))}
                                            unstyled
                                            classNames={reactSelectStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <Button buttonType="submit" text="update" />
                            </div>
                        </form>
                    </div>
                </div>)}
        </div>
    )
}

export default EditProjectPopup