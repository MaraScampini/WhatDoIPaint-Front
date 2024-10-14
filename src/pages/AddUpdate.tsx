import { useParams } from "react-router-dom"
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation"
import { useRef } from "react"

interface UpdateData {
    projectId: number,
    images?: Array<string>,
    title?: string,
    description?: string,
    elements?: Array<number>,
    squads?: Array<number>
}

const AddUpdate = () => {

    const { projectId } = useParams();
    const initialUpdateData = {
        projectId: projectId,
        images: [],
        title: "",
        description: "",
        elements: [],
        squads: []
    };

    let { formValues, handleInputChange, handleMultipleImagesDrop, handleDragOver, handleMultipleFilesSelect, handleDeleteImage } = useFormValidation(initialUpdateData);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="text-offWhite flex flex-col ms-10 ml-10">
            <form>
                <div className="flex w-full justify-between">
                    <div className="w-1/3">
                        <Input
                            type="text"
                            name="title"
                            value={formValues.title}
                            onChange={handleInputChange}
                        />

                        <div className="py-3">
                            <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                            <textarea
                                className="font-display text-offWhite bg-darkGrey h-60 resize-none rounded-md px-5 py-3 mb-2 w-full"
                                name="description"
                                value={formValues.description}
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
                        >{formValues.images.length > 0 ? (
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
                    </div>
                </div>
            </form>
            <div className="bg-red-500"> TABLA </div>
        </div>
    )
}

export default AddUpdate