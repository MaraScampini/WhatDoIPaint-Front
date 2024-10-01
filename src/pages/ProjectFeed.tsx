import { getProjectInfoById } from "../services/projectService";
import useErrorStore from "../store/useErrorStore";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface ProjectData {
    brand: string,
    description: string,
    elements?: Array<any>,
    gallery?: Array<string>,
    level: string,
    name: string,
    squads?: Array<any>,
    techniques?: Array<string>,
    updates?: Array<any>
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
                    <div className="text-offWhite">{projectData.brand}</div>
                ) : (
                    <div>error</div>
                )
            }
        </div>
    )
}

export default ProjectFeed