import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useEffect, useState } from "react";
import { getRandomProject } from "../services/projectService";
import useErrorStore from "../store/useErrorStore";

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
    projectData: ProjectData,
    projectParams: ProjectParams
}

interface ProjectParams {
    level?: number,
    technique?: number,
    priority?: boolean,
    brand?: number
}

const RandomProjectPopup: React.FC<ModalProps> = ({ isOpen, onClose, projectData, projectParams }) => {
    const navigate = useNavigate();

    const [bannedProjects, setBannedProjects] = useState<string>("");
    const [data, setData] = useState<ProjectData>(projectData);
    const [formattedDate, setFormattedDate] = useState("");
    const setError = useErrorStore((state) => state.setError);

    useEffect(() => {
        if (projectData && Object.keys(projectData).length > 0) {
            setData(projectData);
            setFormattedDate(new Date(data.lastUpdate.date).toLocaleDateString('es-ES'));
        }
    }, [projectData])

    const goToProject = () => {
        navigate(`/project/${data.id}`)
    }

    const handleGetNewProject = () => {
        if (bannedProjects !== "") {
            setBannedProjects(bannedProjects + ',' + data.id);
        } else {
            setBannedProjects(String(data.id))
        }
    }

    useEffect(() => {
        const getProject = async () => {
            let newProjectData = await getRandomProject({ ...projectParams, banned: bannedProjects });
            if (newProjectData && Object.keys(newProjectData).length > 0) {
                setData(newProjectData);
            } else {
                setError('No other project fits the requirements');
                if (bannedProjects.includes(String(data.id))) {
                    setBannedProjects(bannedProjects.replace(`,${data.id}`, '').replace(`${data.id}`, ''));
                }
            }
        }
        isOpen && getProject();
    }, [bannedProjects])

    const handleClosePopup = () => {
        setBannedProjects("");
        onClose();
    }

    if (!isOpen) return null;
    return (

        <div className="bg-darkBg bg-opacity-75 fixed inset-0 flex items-center justify-center z-40">
            <div className="w-1/2 h-2/5 bg-darkGrey rounded-md
                                flex flex-col items-center justify-center 
                                 text-offWhite font-display uppercase text-3xl 
                                relative
                ">
                <div className="absolute top-5 right-5 text-lightTeal hover:text-offWhite hover:cursor-pointer"
                    onClick={handleClosePopup}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                {data.id !== 0 ? (
                    <div className="flex flex-col items-center">
                        <p className="text-lightTeal text-4xl mb-3">{data.name}</p>
                        <p className="">Last painted: {formattedDate}</p>
                        <Button onClick={goToProject} text='Go to project' buttonType="button" />
                        <Button onClick={handleGetNewProject} text='Try again' buttonType="button" classNames="mt-[15px]" />
                    </div>
                ) : (<div>No project meet those requirements</div>)
                }

                </div>
        </div>
            )
}

            export default RandomProjectPopup