import { useNavigate } from "react-router-dom";
import Button from "./Button";

interface ProjectData {
    id: number,
    name: string,
    lastUpdate: Date
}

interface Date {
    date: string,
    timezone_type?: string,
    timezone?: string
}

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    projectData: ProjectData
}

const RandomProjectPopup: React.FC<ModalProps> = ({ isOpen, onClose, projectData }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const formattedDate = new Date(projectData.lastUpdate.date).toLocaleDateString('es-ES');

    const goToProject = () => {
        navigate(`/project/${projectData.id}`)
    }

    return (
        <div className="bg-darkBg bg-opacity-75 fixed inset-0 flex items-center justify-center z-40">
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
                <p className="text-lightTeal text-4xl mb-3">{projectData.name}</p>
                <p className="">Last painted: {formattedDate}</p>
                <Button onClick={goToProject} text='Go to project' buttonType="button"/>
                <Button text='Try again' buttonType="button" classNames="mt-[15px]"/>
            </div>
        </div>
    )
}

export default RandomProjectPopup