import { getProjectInfoById } from "../services/projectService";
import useErrorStore from "../store/useErrorStore";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Tag from "../components/Tag";
import Button from "../components/Button";
import { AxiosError } from "axios";

interface ProjectData {
    brand: string,
    description: string,
    elements?: Array<Elements>,
    gallery?: Array<string>,
    level: string,
    name: string,
    squads?: Array<Squads>,
    techniques?: Array<string>,
    updates?: Array<Update>
}

interface LastUpdate {
    date: string,
    timezone: string,
    timezone_type: number
}

interface Elements {
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

const ProjectFeed = () => {
    const setError = useErrorStore((state) => state.setError);
    const { projectId } = useParams();
    const navigate = useNavigate();

    const { data: projectData, error } = useQuery<ProjectData>({
        queryKey: ['projectById', projectId],
        queryFn: () => getProjectInfoById(projectId!),
        enabled: !!projectId
    })

    if (error) {
        if (error instanceof AxiosError && error.status === 401) {
            navigate('/login');
        } else {
            setError(error.message);
        }
    }

    const handleAddUpdate = () => {
        console.log('add update');
    }

    const handleAddElements = () => {
        console.log('add elements');
    }

    const handleChangeCoverImage = () => {
        console.log('change cover image');
    }

    const handleGoToUpdate = (updateId: number) => {
        navigate(`/update/${updateId}`);
    }

    const handleOpenImage = (imageUrl: string) => {
        console.log(imageUrl)
        window.open(imageUrl, '_blank');
    }

    return (
        <div className="text-offWhite">
            {
                projectData ? (
                    <div className="flex flex-col items-center">
                        <div className="font-display flex w-full gap-x-3 px-12 pt-5 justify-between">
                            {/* PROJECT BASIC INFO */}
                            <div className="flex flex-col w-3/6">
                                <div className="text-darkTeal text-3xl font-semibold">{projectData.name}</div>
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
                                {projectData.elements && projectData.elements?.length > 0 ? (
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
                                            <div className="flex flex-col font-normal">
                                                {projectData.elements?.map((element, index) => (
                                                    <div key={index} className="flex border-b border-lightTeal py-2">
                                                        <div className="text-left w-2/6 px-3 border-lightTeal">{element.name}</div>
                                                        <div className="w-2/6 px-3 border-l border-lightTeal">{new Date(element.lastUpdate.date).toLocaleDateString('es-ES')}</div>
                                                        <div className="w-1/6 px-3 border-l border-lightTeal">{element.status}</div>
                                                        <div className="w-1/6 px-3 border-l border-lightTeal">1</div>
                                                    </div>
                                                ))}

                                                {projectData.squads?.map((squad, squadIndex) => (
                                                    <React.Fragment key={squadIndex}>
                                                        <div className="flex border-b border-lightTeal py-2">
                                                            <div className="text-left w-2/6 px-3 border-lightTeal flex justify-between">
                                                                {squad.name}
                                                                <Tag text="squad" />
                                                            </div>
                                                            <div className="w-2/6 px-3 border-l border-lightTeal">{new Date(squad.lastUpdate.date).toLocaleDateString('es-ES')}</div>
                                                            <div className="w-1/6 px-3 border-l border-lightTeal">...</div>
                                                            <div className="w-1/6 px-3 border-l border-lightTeal">{squad.amount}</div>
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
                            <div className="text-offWhite w-3/6 flex h-2/3 justify-center py-3">
                                <div className="bg-darkGrey w-5/6 grid grid-cols-3 grid-rows-3 gap-5 p-3 rounded-md">
                                    {projectData.gallery?.map((image, index) => (
                                        <div onClick={() => handleOpenImage(image)} key={index}
                                            className={`aspect-square bg-cover rounded-md ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                                            style={{ backgroundImage: `url(${image})` }}
                                        >
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-x-3">
                            <Button buttonType="button" text="Add elements" onClick={handleAddElements} />
                            <Button buttonType="button" text="Add update" onClick={handleAddUpdate} />
                            <Button buttonType="button" text="change cover image" onClick={handleChangeCoverImage} />
                        </div>
                        {/* PROJECT UPDATES */}
                        <div className="w-full flex flex-col px-12 gap-y-5 py-3">
                            {projectData.updates?.map((update, updateIndex) => {
                                const hasContent = update.title || update.description || (update.images && update.images.length > 0) || (update.elements && update.elements.length > 0);

                                return hasContent ? (
                                    <div key={updateIndex} onClick={() => handleGoToUpdate(update.id)} className="bg-darkGrey rounded-md p-5 font-display flex justify-between hover:border hover:border-lightTeal hover:cursor-pointer transition-all duration-100">
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
                    </div>
                ) : (
                    <div>error</div>
                )
            }
        </div >
    )
}

export default ProjectFeed