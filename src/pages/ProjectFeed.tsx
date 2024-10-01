import { getProjectInfoById } from "../services/projectService";
import useErrorStore from "../store/useErrorStore";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Tag from "../components/Tag";
import Button from "../components/Button";

interface ProjectData {
    brand: string,
    description: string,
    elements?: Array<Elements>,
    gallery?: Array<string>,
    level: string,
    name: string,
    squads?: Array<Squads>,
    techniques?: Array<string>,
    updates?: Array<any>
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

const ProjectFeed = () => {
    const token = localStorage.getItem('authToken');
    const setError = useErrorStore((state) => state.setError);
    const { projectId } = useParams();

    const { data: projectData, error } = useQuery<ProjectData>({
        queryKey: ['projectById', projectId],
        queryFn: () => getProjectInfoById(token!, projectId!),
        enabled: !!projectId
    })

    if (error) setError(error.message);

    console.log(projectData, error);

    return (
        <div className="text-offWhite">
            {
                projectData ? (
                    <div className="flex flex-col items-center">
                        <div className="font-display flex w-full gap-x-3 px-5 pt-5 justify-between">
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
                                <div className="flex flex-col mt-5 me-3 border border-lightTeal rounded-md">
                                    {/* Table Header */}
                                    <div className="flex bg-darkTeal text-xl uppercase text-center py-2">
                                        <div className="w-2/6 px-3 border-l border-lightTeal">Element name</div>
                                        <div className="w-2/6 px-3 border-l border-lightTeal">Last Update</div>
                                        <div className="w-1/6 px-3 border-l border-lightTeal">Status</div>
                                        <div className="w-1/6 border-l border-lightTeal">Units</div>
                                    </div>

                                    {/* Table Body */}
                                    <div className="flex flex-col">
                                        {projectData.elements?.map((element, index) => (
                                            <div key={index} className="flex border-b border-lightTeal py-2">
                                                <div className="text-left w-2/6 px-3 border-lightTeal">{element.name}</div>
                                                <div className="w-2/6 px-3 border-l border-lightTeal">{new Date(element.lastUpdate.date).toLocaleDateString('es-ES')}</div>
                                                <div className="w-1/6 px-3 border-l border-lightTeal">{element.status}</div>
                                                <div className="w-1/6 px-3 border-l border-lightTeal">1</div>
                                            </div>
                                        ))}

                                        {projectData.squads?.map((squad, index) => (
                                            <React.Fragment key={index}>
                                                <div className="flex border-b border-lightTeal py-2">
                                                    <div className="text-left w-2/6 px-3 border-lightTeal flex justify-between">
                                                        {squad.name}
                                                        <Tag text="squad" />
                                                    </div>
                                                    <div className="w-2/6 px-3 border-l border-lightTeal">{new Date(squad.lastUpdate.date).toLocaleDateString('es-ES')}</div>
                                                    <div className="w-1/6 px-3 border-l border-lightTeal">...</div>
                                                    <div className="w-1/6 px-3 border-l border-lightTeal">{squad.amount}</div>
                                                </div>
                                                {squad.elements?.map((element, index) => (
                                                    <div key={index} className="flex border-b border-lightTeal py-2">
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

                            </div>
                            <div className="text-offWhite w-3/6 flex justify-center py-3 bg-red-400">
                                <div className="bg-red-700 w-5/6">
                                    GALLERY
                                </div>
                            </div>
                        </div>
                        <Button buttonType="button" text="Add update"/>
                    </div>
                ) : (
                    <div>error</div>
                )
            }
        </div>
    )
}

export default ProjectFeed