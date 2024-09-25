import Select from 'react-select';
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation";
import { reactSelectStyles } from "../utils/reactSelectStyles";
import { useEffect, useState } from "react";
import { getBrandOptions, getLevelOptions, getTechniquesOptions } from "../services/selectorService";

interface Option {
    value: number;
    label: string;
    id: number;
}

interface ProjectData {
    name: string;
    description: string;
    level: number;
    brand: number;
    techniques: number[];
    image: string;
    priority: boolean;
}

const AddProject = () => {
    const initialProjectData: ProjectData = {
        name: "",
        description: "",
        level: 0,
        brand: 0,
        techniques: [],
        image: "",
        priority: false
    };
    const token = localStorage.getItem('authToken');

    const [levelOptions, setLevelOptions] = useState<Option[]>([]);
    const [brandOptions, setBrandOptions] = useState<Option[]>([]);
    const [techniqueOptions, setTechniqueOptions] = useState<Option[]>([]);



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

    let { formValues, handleInputChange, handleReactSelectChange, handleMultiSelectChange } = useFormValidation(initialProjectData);

    return (
        <div className="text-offWhite flex flex-col ms-10 ml-10">
            <div className="font-display text-3xl font-semibold">New Project</div>
            <form className="w-full flex flex-col">
                <div className="w-1/4">
                    <Input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="w-1/4 py-3">
                    <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                    <textarea
                        className='font-display text-offWhite bg-darkGrey h-60 resize-none rounded-md px-5 py-3 mb-2 w-full'
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        maxLength={1000}
                    />
                </div>

                <div className="flex space-x-5">
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
                    </div>

                    <div className="w-1/5">
                        <p className="font-display text-lightTeal uppercase font-light pb-1">Techniques</p>
                        <Select
                            isMulti
                            closeMenuOnSelect={false}
                            options={techniqueOptions}
                            onChange={handleMultiSelectChange('techniques')}
                            value={techniqueOptions.filter(option => formValues.techniques.includes(option.id))}
                            unstyled
                            classNames={reactSelectStyles}
                        />
                    </div>
                </div>
                <div>
                    
                </div>
            </form>
        </div >
    )
}

export default AddProject