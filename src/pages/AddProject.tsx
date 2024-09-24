import ReactSelect, { SingleValue } from "react-select";
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation";
import { reactSelectStyles } from "../utils/reactSelectStyles";
import { useEffect, useState } from "react";
import { getLevelOptions } from "../services/selectorService";

interface Option {
    id: number; 
    label: string;
}

const AddProject = () => {
    const initialProjectData = {
        name: "",
        description: "",
        level: 0,
        brand: "",
        techniques: [],
        image: "",
        priority: false
    };
    const token = localStorage.getItem('authToken');

    const [levelOptions, setLevelOptions] = useState<Option[]>([]);

    useEffect(() => {
        const loadSelectors = async () => {
            if(token) {
                const levels = await getLevelOptions(token);
                setLevelOptions(levels);
            }
        }

        loadSelectors();
    }, [])

    let { formValues, handleInputChange, handleSelectorChange } = useFormValidation(initialProjectData);

    const handleReactSelectChange = (selectedOption: SingleValue<Option>) => {
        const value = selectedOption ? selectedOption.id : 0;
        handleSelectorChange('level', value);
    };

    return (
        <div className="text-offWhite flex flex-col ms-10 ml-10">
            <div className="font-display text-3xl font-semibold">New Project</div>
            <form className="w-1/4 flex flex-col">
                <Input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                />

                <div className="w-full py-3">
                    <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                    <textarea
                        className='font-display text-offWhite bg-darkGrey h-40 resize-none rounded-md px-5 py-3 w-full'
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        maxLength={1000}
                    />
                </div>

                <div className="w-full">
                    <p className="font-display text-lightTeal uppercase font-light pb-1">Level</p>
                    <ReactSelect
                        options={levelOptions}
                        onChange={handleReactSelectChange}
                        value={levelOptions.find(option => option.id === formValues.level)}
                        unstyled
                        classNames={reactSelectStyles}
                    />
                </div>
            </form>
        </div >
    )
}

export default AddProject