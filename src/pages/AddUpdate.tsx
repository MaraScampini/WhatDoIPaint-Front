import { useNavigate, useParams } from "react-router-dom"
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation"
import { useEffect, useRef, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { getElementsByProjectId, getSquadsByProjectId, getStatusOptions } from "../services/selectorService"
import useErrorStore from "../store/useErrorStore"
import Select, { MultiValue, SingleValue } from "react-select"
import { reactSelectStyles } from "../utils/reactSelectStyles"
import { getElementsAndSquadsByProjectId } from "../services/projectService"
import Button from "../components/Button"
import { createUpdate } from "../services/updateService"

interface UpdateData {
    projectId: string,
    images?: Array<string>,
    title?: string,
    description?: string,
    elements?: Array<SelectedElement>
    squads?: Array<SelectedSquad>
}

interface Option {
    id: number,
    label: string,
    value: number
}

interface ElementsAndSquads {
    elements: Array<Element>,
    squads: Array<Squad>
}

interface Element {
    id: number,
    name: string,
    lastUpdate: {
        date: string,
        timezone_type: string,
        timezone: string
    },
    status: string,
    statusId: number
}

interface Squad {
    id: number,
    name: string,
    lastUpdate: {
        date: string,
        timezone_type: string,
        timezone: string
    },
    amount: number,
    elements: Array<{
        amount: number,
        status: string,
        statusId: number
    }>
}

interface SelectedElement {
    id: number,
    status: number
}

interface SelectedSquad {
    id: number,
    elements: Array<{
        amount: number,
        status: string,
        statusId: number
    }>
}

interface SquadsOpen {
    id: number,
    open: boolean
}

const AddUpdate = () => {

    const { projectId } = useParams();
    const setError = useErrorStore((state) => state.setError);
    const navigate = useNavigate();
    const initialUpdateData: UpdateData = {
        projectId: projectId!,
    };
    const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
    const [selectedSquads, setSelectedSquads] = useState<SelectedSquad[]>([]);
    const [isSquadOpen, setIsSquadOpen] = useState<SquadsOpen[]>([]);
    const [objectToSend, setObjectToSend] = useState<UpdateData>(initialUpdateData);

    const [{ data: elementOptions, error: errorElements },
        { data: squadOptions, error: errorSquads },
        { data: projectData, error: errorProject },
        { data: statusOptions, error: errorStatus }
    ] = useQueries({
        queries: [
            {
                queryKey: ['elementOptions'],
                queryFn: () => getElementsByProjectId(projectId!),
                enabled: !!projectId
            },
            {
                queryKey: ['squadOptions'],
                queryFn: () => getSquadsByProjectId(projectId!),
                enabled: !!projectId
            },
            {
                queryKey: ['projectData' + projectId],
                queryFn: () => getElementsAndSquadsByProjectId(projectId!),
                enabled: !!projectId
            },
            {
                queryKey: ['statusOptions'],
                queryFn: () => getStatusOptions()
            }
        ]
    }) as [{ data: Option[] | undefined, error: Error },
            { data: Option[] | undefined, error: Error },
            { data: ElementsAndSquads | undefined, error: Error },
            { data: Option[] | undefined, error: Error }]

    [errorElements, errorSquads, errorProject, errorStatus].map(error => {
        setError(error?.message);
    })

    let { formValues, handleInputChange, handleMultipleImagesDrop, handleDragOver, handleMultipleFilesSelect, handleDeleteImage } = useFormValidation(initialUpdateData);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.value = "";
        }
    };

    const handleAddSelectedElements = (selectedOptions: MultiValue<{ value: number }>) => {
        const values = selectedOptions
            ? selectedOptions.map(option => ({
                id: option.value,
                status: projectData?.elements.find(element => element.id === option.value)!.statusId || 1
            })) : [];

        setSelectedElements(values);
    }

    const handleAddStatusToElement = (id: number) => (selectedOption: SingleValue<Option>) => {
        const value = selectedOption ? selectedOption.id : 1;

        setSelectedElements(prevElements =>
            prevElements.map(element =>
                element.id === id
                    ? { ...element, status: value }
                    : element
            )
        );
    }

    const handleAddSelectedSquads = (selectedOptions: MultiValue<{ value: number }>) => {
        const values = selectedOptions
            ? selectedOptions.map(option => ({
                id: option.value,
                elements: projectData?.squads.find(squad => squad.id === option.value)!.elements || []
            })) : [];

        setSelectedSquads(values);

        setIsSquadOpen(prevState => [
            ...prevState,
            ...selectedOptions.map(option => ({
                id: option.value,
                open: false
            }))
        ]
        )
    }

    const handleToggleSquadOpen = (id: number) => {
        setIsSquadOpen(prevState =>
            prevState.map(squad =>
                squad.id === id
                    ? { ...squad, open: !squad.open }
                    : squad
            )
        );
    }


    const handleAddStatusToSquad = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const statusId = statusOptions?.find(option => option.label === name)!.id;
        setSelectedSquads(prevSquads =>
            prevSquads.map(squad =>
                squad.id === id
                    ? {
                        ...squad,
                        elements: squad.elements.some(el => el.statusId === statusId)
                            ? squad.elements.map(el =>
                                el.statusId === statusId
                                    ? { ...el, amount: parseInt(value) }
                                    : el
                            )
                            : [...squad.elements, { statusId: statusId!, status: name, amount: parseInt(value) }]
                    }
                    : squad
            )
        );

    }


    useEffect(() => {
        setObjectToSend({
            ...formValues,
            elements: selectedElements,
            squads: selectedSquads,
        });

    }, [formValues, selectedElements, selectedSquads]);

    const handleSendUpdate = async () => {
        await createUpdate(objectToSend);

        navigate(`/project/${projectId}`);
    }


    return (
        <div className="font-display text-offWhite flex flex-col ms-10 ml-10">
            <div className="flex gap-x-3 items-center">
                <div onClick={() => navigate(`/project/${projectId}`)} className="hover:text-lightTeal transition-all duration-100 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                <div className="text-darkTeal text-3xl font-semibold">Add update</div>
            </div>
            <form>
                <div className="flex w-full justify-between">
                    <div className="w-1/3">
                        <Input
                            type="text"
                            name="title"
                            value={formValues.title || ""}
                            onChange={handleInputChange}
                        />

                        <div className="py-3">
                            <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                            <textarea
                                className="font-display text-offWhite bg-darkGrey h-60 resize-none rounded-md px-5 py-3 mb-2 w-full"
                                name="description"
                                value={formValues.description || ""}
                                onChange={handleInputChange}
                                maxLength={1000}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-2/5 me-10">
                        <p className="font-display text-lightTeal uppercase font-light">upload images</p>
                        <div
                            className="mt-4 p-6 border-dashed border-2 border-lightTeal rounded-lg cursor-pointer min-h-80 flex items-center justify-center text-lightTeal hover:border-solid relative"
                            onDrop={handleMultipleImagesDrop('images')}
                            onDragOver={handleDragOver}
                            onClick={handleClick}
                        >{formValues?.images && formValues.images.length > 0 ? (
                            <div>
                                <div onClick={(e) => handleDeleteImage(e, true)} className="absolute right-2 top-2 hover:text-offWhite">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <div className="mt-4 grid grid-cols-4 gap-5">
                                    {formValues.images.map((image, index) => (
                                        <img key={index} src={image} alt="Preview" className="max-h-40 object-contain" />
                                    ))}

                                </div>
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
                            multiple
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleMultipleFilesSelect('images')}
                        />
                        <div className="flex justify-center">
                            <Button text="Send" buttonType="button" onClick={handleSendUpdate} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-3 mb-5 w-2/3">
                    <p className="font-display text-lightTeal font-light uppercase pb-1 text-xl">Choose elements to update</p>
                    <div className="flex gap-x-5 w-full px-5 items-center">
                        <div className="w-1/2">
                            <p className="font-display text-lightTeal font-light uppercase pb-1">Elements</p>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={elementOptions}
                                onChange={handleAddSelectedElements}
                                value={elementOptions?.filter(option => selectedElements.some(element => element.id === option.id))}
                                unstyled
                                classNames={reactSelectStyles}
                            />
                        </div>
                        <div className="w-1/2">
                            <p className="font-display text-lightTeal font-light uppercase pb-1">Squads</p>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={squadOptions}
                                onChange={handleAddSelectedSquads}
                                value={squadOptions?.filter(option => selectedSquads.some(squad => squad.id === option.id))}
                                unstyled
                                classNames={reactSelectStyles}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex w-full px-5 mb-12">
                <div className="flex flex-col gap-y-5 w-1/3 px-5 mb-12">
                    {projectData?.elements.filter(option => selectedElements.some(element => element.id === option.id)).map((element, elementIndex) => (
                        <div key={elementIndex} className="w-full flex items-center justify-between bg-darkGrey rounded-md p-5">
                            <div>{element.name}</div>
                            <div className="w-1/3">
                                <Select
                                    options={statusOptions}
                                    onChange={handleAddStatusToElement(element.id)}
                                    value={statusOptions?.filter(option => option.id === selectedElements.find(selectedElement => selectedElement.id === element.id)?.status)}
                                    unstyled
                                    classNames={reactSelectStyles}
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>
                    ))}

                </div>
                <div className="grid grid-cols-2 gap-5 w-2/3 px-5 mb-12 font-display">
                    {projectData?.squads.filter(option => selectedSquads.some(element => element.id === option.id)).map((squad, squadIndex) => (
                        <div key={squadIndex} >
                            <div className={`w-full flex items-center justify-between bg-darkGrey p-5 ${isSquadOpen.find(openSquad => openSquad.id === squad.id)?.open ? 'rounded-t-md' : 'rounded-md'}`}>
                                <div>{squad.name}</div>
                                <div onClick={() => handleToggleSquadOpen(squad.id)} className="hover:text-lightTeal hover:cursor-pointer">
                                    {isSquadOpen.find(openSquad => openSquad.id === squad.id)?.open ? (
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                            </svg>

                                        </div>
                                    ) : (
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isSquadOpen.find(openSquad => openSquad.id === squad.id)?.open && (
                                <div className="flex flex-col justify-center">
                                    <div className="bg-darkGrey flex justify-center gap-x-5 items-center">
                                        <p className="text-lightTeal font-light">TOTAL UNITS IN SQUAD: </p>
                                        <p className="text-xl">{squad.amount}</p>
                                    </div>
                                    <div className="w-full grid grid-cols-3 gap-3 items-center justify-between bg-darkGrey rounded-b-md p-5">
                                        {statusOptions?.map(status => (
                                            <div className="">
                                                <Input
                                                    type="number"
                                                    name={status.label}
                                                    value={selectedSquads.find(selectedSquad => selectedSquad.id === squad.id)?.elements.find(el => el.statusId === status.id)?.amount || 0}
                                                    onChange={(e) => handleAddStatusToSquad(squad.id, e)}
                                                    classNames="border border-offWhite w-[100px]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div >
        </div >
    )
}

export default AddUpdate