import ReactSelect, { SingleValue } from "react-select";
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation";

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

    const options = [
        {
            id: 1,
            label: "hola"
        },
        {
            id: 2,
            label: "adios"
        }
    ]

    const validationRules = {};


    let { formValues, handleInputChange, handleSelectorChange } = useFormValidation(initialProjectData, validationRules);

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
                        options={options}
                        onChange={handleReactSelectChange}
                        value={options.find(option => option.id === formValues.level)}
                        unstyled
                        classNames={{
                            control: () => "bg-darkGrey rounded-md font-display ps-3",
                            dropdownIndicator: () => "text-lightTeal pe-2 cursor-pointer hover:text-offWhite transition-colors duration-300",
                            menuList: () => "bg-darkGrey font-display rounded-b-md",
                            option: () => "ps-2 py-2 hover:bg-lightTeal hover:bg-opacity-50 hover:cursor-pointer transition-all ease-in-out duration-300",
                            placeholder: () => "text-darkTeal"
                        }}
                    />
                </div>
            </form>
        </div >
    )
}

export default AddProject