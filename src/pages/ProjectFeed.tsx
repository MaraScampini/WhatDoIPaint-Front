import { editProject, getProjectInfoById, toggleArchivedProject } from "../services/projectService";
import useErrorStore from "../store/useErrorStore";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import Tag from "../components/Tag";
import Button from "../components/Button";
import { AxiosError } from "axios";
import Loader from "../components/Loader";
import { setInterceptor } from "../services/apiClient";
import useFormValidation from "../hooks/useFormValidation";
import useProjectStore from "../store/useProjectStore";
import EditProjectPopup from "../components/EditProjectPopup";
import FinishProjectPopup from "../components/FinishProjectPopup";
import { deleteElement, deleteSquad } from "../services/elementService";

interface ProjectData {
    id: number,
    brand: string,
    description: string,
    elements?: Array<Elements>,
    gallery?: ProjectGallery,
    level: string,
    name: string,
    squads?: Array<Squads>,
    techniques?: Array<string>,
    updates?: Array<Update>,
    archived: boolean,
    finished: boolean
}

interface ProjectGallery {
    cover: string,
    images: Array<string>
}

interface LastUpdate {
    date: string,
    timezone: string,
    timezone_type: number
}

interface Elements {
    id: number,
    name: string,
    lastUpdate: LastUpdate,
    status: string
}

interface Squads {
    amount: number,
    elements: Array<{ amount: number, status: string }>,
    id: number,
    lastUpdate: LastUpdate,
    name: string
}

interface Update {
    date: LastUpdate,
    description: string,
    elements: Array<string>,
    id: number,
    images: Array<string>,
    title: string
}

interface EditProjectInfo {
    projectId: number,
    image?: string
}

const ProjectFeed = () => {
    const setError = useErrorStore((state) => state.setError);
    const { projectId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const setProject = useProjectStore((state) => state.setProject);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isMarkAsFinishedModalOpen, setIsMarkAsFinishedModalOpen] = useState(false);

    let editProjectInfo: EditProjectInfo = {
        projectId: 0,
        image: ""
    }
    let { handleFileSelect, formValues } = useFormValidation(editProjectInfo);


    useEffect(() => {
        setInterceptor(navigate);
    }, [navigate])

    const { data: projectData, error, refetch } = useQuery<ProjectData>({
        queryKey: ['projectById', projectId],
        queryFn: () => getProjectInfoById(projectId!),
        enabled: !!projectId
    })

    useEffect(() => {
        formValues.projectId = projectData?.id || 0;
        console.log(formValues)
    }, [formValues])

    if (error) {
        if (error instanceof AxiosError && error.status === 401) {
            navigate('/login');
        } else {
            setError(error.message);
        }
    }

    const handleAddUpdate = () => {
        navigate(`/update/add/${projectId}`);
    }

    const handleAddElements = () => {
        navigate(`/element/add/${projectData?.id}`);
    }

    const handleChangeCoverImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.value = "";
        }
    }

    useEffect(() => {
        if (formValues.image) {
            editProject(formValues).then(() => refetch());
        }
    }, [formValues])

    const handleGoToUpdate = (updateId: number) => {
        navigate(`/update/${updateId}`);
    }

    const handleOpenImage = (imageUrl: string) => {
        window.open(imageUrl, '_blank');
    }

    const handleOpenGallery = () => {
        setProject({ id: projectData!.id, name: projectData!.name });
        navigate(`/project/gallery/${projectId}`);
    }

    const handleOpenUpdateGallery = () => {
        setProject({ id: projectData!.id, name: projectData!.name });
        navigate(`/project/updates/${projectId}`)
    }

    const handleCloseEditProjectPopup = () => {
        setIsEditProjectModalOpen(false);
        refetch();
    }

    const handleCloseMarkAsFinishedProjectPopup = () => {
        setIsMarkAsFinishedModalOpen(false);
        refetch();
    }

    const handleToggleArchiveProject = async () => {
        await toggleArchivedProject(projectId!);
        refetch();
    }

    const handleDeleteSquadOrElement = async (id: number, type: string) => {
        if(type === 'squad') {
            await deleteSquad(id);
        } else if (type === 'element') {
            await deleteElement(id);
        }

        refetch();
    }

    return (
        <div className="text-offWhite">
            {
                projectData ? (
                    <div className="flex flex-col items-center">
                        <div className="font-display flex w-full gap-x-3 px-12 pt-5 justify-between">
                            {/* PROJECT BASIC INFO */}
                            <div className="flex flex-col w-3/6">
                                <div className="flex gap-x-3 items-center">
                                    <div onClick={() => navigate(`/feed`)} className="hover:text-lightTeal transition-all duration-100 hover:cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                        </svg>
                                    </div>
                                    <div className="text-darkTeal text-3xl font-semibold">{projectData.name}</div>
                                    {projectData.archived && (<div><Tag text="archived" /></div>)}
                                    <div className="flex items-start ps-5 h-full hover:cursor-pointer hover:text-lightTeal transition-colors duration-200 ease-in-out"
                                        onClick={() => setIsEditProjectModalOpen(true)}
                                        title="Edit project"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </div>
                                    <div className="flex items-start ps-5 h-full hover:cursor-pointer hover:text-lightTeal transition-colors duration-200 ease-in-out"
                                        title="Toggle archived status"
                                        onClick={handleToggleArchiveProject}
                                    >
                                        {projectData.archived ? (
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>

                                            </div>
                                        ) : (
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start ps-5 h-full hover:cursor-pointer hover:text-lightTeal transition-colors duration-200 ease-in-out"
                                        title="Finish project"
                                        onClick={() => setIsMarkAsFinishedModalOpen(true)}>
                                        {projectData.finished ?
                                            (
                                                <div></div>
                                            ) : (
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                                    </svg>

                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="text-offWhite text-justify pt-4 pe-5 w-2/3">{projectData.description}</div>
                                <div className="uppercase text-xl text-lightTeal flex gap-x-12 pt-5">
                                    <p className="">{projectData.brand}</p>
                                    <p className="">{projectData.level}</p>
                                    <div className="flex gap-3">
                                        {projectData.techniques?.map((technique, index) => (
                                            <p className="" key={index}>
                                                {technique}{index < projectData.techniques!.length - 1 ? ',' : ''}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                {projectData.elements && projectData.elements?.length > 0 || projectData.squads && projectData.squads.length > 0 ? (
                                    <React.Fragment>
                                        {/* ELEMENTS TABLE */}
                                        <div className="flex flex-col mt-5 me-3 border-t border-x border-lightTeal rounded-md font-light">
                                            {/* HEADER */}
                                            <div className="flex bg-darkTeal text-xl uppercase text-center py-2">
                                                <div className="w-2/6 px-3 border-l border-lightTeal">Element name</div>
                                                <div className="w-2/6 px-3 border-l border-lightTeal">Last Update</div>
                                                <div className="w-1/6 px-3 border-l border-lightTeal">Status</div>
                                                <div className="w-1/6 border-l border-lightTeal">Units</div>
                                            </div>

                                            {/* BODY */}
                                            <div className="flex flex-col font-normal relative">
                                                {projectData.elements?.map((element, index) => (
                                                    <div key={index} className="flex border-b border-lightTeal py-2 relative group">
                                                        <div className="text-left w-2/6 px-3 border-lightTeal">{element.name}</div>
                                                        <div className="w-2/6 px-3 border-l border-lightTeal">{new Date(element.lastUpdate.date).toLocaleDateString('es-ES')}</div>
                                                        <div className="w-1/6 px-3 border-l border-lightTeal">{element.status}</div>
                                                        <div className="w-1/6 px-3 border-l border-lightTeal">1</div>
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-lightTeal" onClick={() => handleDeleteSquadOrElement(element.id, 'element')}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}

                                                {projectData.squads?.map((squad, squadIndex) => (
                                                    <React.Fragment key={squadIndex}>
                                                        <div className="flex border-b border-lightTeal py-2 relative group">
                                                            <div className="text-left w-2/6 px-3 border-lightTeal flex justify-between">
                                                                {squad.name}
                                                                <Tag text="squad" />
                                                            </div>
                                                            <div className="w-2/6 px-3 border-l border-lightTeal">{new Date(squad.lastUpdate.date).toLocaleDateString('es-ES')}</div>
                                                            <div className="w-1/6 px-3 border-l border-lightTeal">...</div>
                                                            <div className="w-1/6 px-3 border-l border-lightTeal">{squad.amount}</div>
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-lightTeal" onClick={() => handleDeleteSquadOrElement(squad.id, 'squad')}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {squad.elements?.map((element, elementIndex) => (
                                                            <div key={elementIndex} className={`flex border-lightTeal border-b py-2 ${squadIndex === projectData.squads!.length - 1 && elementIndex === squad.elements.length - 1 ? 'rounded-b-md' : ''}`}>
                                                                <div className="w-2/6 px-3 border-lightTeal"></div>
                                                                <div className="w-2/6 px-3 border-l border-lightTeal"></div>
                                                                <div className="w-1/6 px-3 border-l border-lightTeal">{element.status}</div>
                                                                <div className="w-1/6 px-3 border-l border-lightTeal">{element.amount}</div>
                                                            </div>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ) : (<p className="mt-10 text-xl flex justify-center">This project has no elements yet</p>)}


                            </div>
                            {/* PROJECT GALLERY */}
                            <div className="text-offWhite w-3/6 flex flex-col h-2/3 items-center justify-center py-3">
                                <div className="bg-darkGrey w-5/6 grid grid-cols-3 grid-rows-3 gap-5 p-3 rounded-t-md">
                                    {projectData.gallery?.cover && (
                                        <div onClick={() => handleOpenImage(projectData.gallery!.cover)}
                                            className={`aspect-square bg-cover rounded-md col-span-2 row-span-2 hover:cursor-pointer inner-border transition-all duration-100`}
                                            style={{ backgroundImage: `url(${projectData.gallery?.cover})` }}
                                        >
                                        </div>
                                    )}
                                    {projectData.gallery?.images.map((image, index) => (
                                        <div onClick={() => handleOpenImage(image)} key={index}
                                            className={`aspect-square bg-cover rounded-md hover:cursor-pointer inner-border transition-all duration-100`}
                                            style={{ backgroundImage: `url(${image})` }}
                                        >
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-darkGrey w-5/6 flex justify-center pb-5 rounded-b-md">
                                    <Button buttonType="button" text="See gallery" onClick={handleOpenGallery} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-x-3">
                            <Button buttonType="button" text="Add elements" onClick={handleAddElements} disabled={projectData.archived || projectData.finished} />
                            <Button buttonType="button" text="Add update" onClick={handleAddUpdate} disabled={projectData.archived || projectData.finished} />
                            <div>
                                <Button buttonType="button" text="change cover image" onClick={handleChangeCoverImage} disabled={projectData.archived || projectData.finished} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect('image')}
                                />
                            </div>

                        </div>
                        {/* PROJECT UPDATES */}
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex flex-col px-12 gap-y-5 py-3">
                                {projectData.updates?.map((update, updateIndex) => {
                                    const hasContent = update.title || update.description || (update.images && update.images.length > 0) || (update.elements && update.elements.length > 0);

                                    return hasContent ? (
                                        <div key={updateIndex} onClick={() => handleGoToUpdate(update.id)} className="bg-darkGrey rounded-md p-5 font-display flex justify-between inner-border hover:cursor-pointer transition-all duration-100">
                                            <div className="flex flex-col w-[90%]">
                                                <p className="text-2xl uppercase font-semibold">{update.title}</p>
                                                <p className="pt-3">{update.description}</p>
                                                <div className="flex gap-x-3">
                                                    {update.images.map((image, imageIndex) => (
                                                        <div key={imageIndex} className="w-[13rem] my-3 aspect-square bg-cover rounded-md"
                                                            style={{ backgroundImage: `url(${image})` }}
                                                        >
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-[10%] items-end">
                                                <p className="text-lightTeal mb-2 text-xl">{new Date(update.date.date).toLocaleDateString('es-ES')}</p>
                                                {update.elements?.map((element, elementIndex) => (
                                                    <div key={elementIndex}>
                                                        <p className="uppercase my-2">{element}</p>
                                                        {elementIndex < update.elements.length - 1 ? (
                                                            <div className="border border-lightTeal w-full"></div>
                                                        ) : ('')}
                                                    </div>))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-x-5 font-display ps-5 my-3 text-xl text-lightTeal">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <p className="text-offWhite">Painted today</p>
                                            <p className="text-offWhite">-</p>

                                            <div>{new Date(update.date.date).toLocaleDateString('es-ES')}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <Button buttonType="button" text="See all updates" classNames="mb-5" onClick={handleOpenUpdateGallery} />
                        </div>
                        <EditProjectPopup isOpen={isEditProjectModalOpen} onClose={handleCloseEditProjectPopup} projectId={projectData.id} projectData={{ name: projectData.name, description: projectData.description }} />
                        <FinishProjectPopup isOpen={isMarkAsFinishedModalOpen} onClose={handleCloseMarkAsFinishedProjectPopup} projectId={projectData.id} />

                    </div >
                ) : (
                    <Loader />
                )
            }
        </div >)
}

export default ProjectFeed
