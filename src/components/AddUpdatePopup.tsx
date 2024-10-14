import { useEffect, useRef, useState } from "react";
import useFormValidation from "../hooks/useFormValidation";
import Button from "./Button";
import { createUpdate } from "../services/updateService";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import useErrorStore from "../store/useErrorStore";

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    projectId: number
}

interface UpdateImagesData {
    projectId: number,
    images: Array<string>
}

const AddUpdatePopup: React.FC<ModalProps> = ({ isOpen, onClose, projectId }) => {

    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);

    const initialImageData: UpdateImagesData = {
        projectId: projectId,
        images: []
    };

    const navigate = useNavigate();
    const setError = useErrorStore((state) => state.setError);

    const { formValues, handleMultipleFilesSelect } = useFormValidation(initialImageData);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        const sendImages = async () => {
            if (formValues.images.length > 0) {
                setIsLoading(true);
                try {
                    await createUpdate(formValues);
                    navigate(`/project/${projectId}`);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        }

        sendImages();

        return () => {
            setIsLoading(false);
        };

    }, [formValues])

    return (
        <div className="bg-darkBg bg-opacity-75 fixed inset-0 flex items-center justify-center z-40">
            {isLoading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="w-1/2 h-2/5 bg-darkGrey rounded-md
                                flex flex-col items-center justify-center 
                                 text-offWhite font-display uppercase text-3xl 
                                relative
                ">
                    <div className="absolute top-5 right-5 text-lightTeal hover:text-offWhite hover:cursor-pointer"
                        onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <p>congratulations</p>
                    <p className="mb-5">you are on a <span className="text-lightTeal">X</span> day streak!</p>
                    <div onClick={() => navigate(`/update/add/${projectId}`)}>
                        <Button text="add more info" buttonType="button" />
                    </div>
                    <div
                        onClick={handleClick}>
                        <Button text="add pictures" buttonType="button" />
                        <input
                            type="file"
                            accept="image/"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleMultipleFilesSelect('images')
                            }
                        />
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default AddUpdatePopup