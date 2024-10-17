import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import useErrorStore from "../store/useErrorStore";
import usePagination from "../hooks/usePagination";
import { useQuery } from "@tanstack/react-query";
import { getProjectUpdateGallery } from "../services/projectService";
import useProjectStore from "../store/useProjectStore";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

interface ProjectUpdates {
    total: number,
    data: Array<UpdateData>
}

interface UpdateData {
    id: number,
    title: string,
    description: string,
    date: string,
    images: Array<string>,
    elements: Array<string>
}

const UpdateGallery = () => {

    const { projectId } = useParams();
    const setError = useErrorStore((state) => state.setError);
    const project = useProjectStore((state) => state.project);
    const navigate = useNavigate();

    const [totalUpdates, setTotalUpdates] = useState(0);
    const { currentPage, totalPages, handleNextPage, handlePreviousPage, goToPage } = usePagination(totalUpdates, 10);

    const { data: projectUpdates, error, refetch, isLoading } = useQuery<ProjectUpdates>({
        queryKey: ['projectUpdateGallery'],
        queryFn: () => getProjectUpdateGallery(projectId!, { page: currentPage, limit: 10 })
    });

    if (error) setError(error.message);

    useEffect(() => {
        const setPaginationTotalUpdates = () => {
            projectUpdates && setTotalUpdates(projectUpdates.total);
        }

        setPaginationTotalUpdates();
    }, [projectUpdates])

    useEffect(() => {
        refetch();
    }, [currentPage])

    const handleGoToUpdate = (updateId: number) => {
        navigate(`/update/${updateId}`);
    }

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="text-offWhite flex w-full flex-col items-center relative min-h-screen">
                    <div className="flex gap-x-3 items-center mb-5 w-full justify-start ps-12">
                        <div onClick={() => navigate(`/project/${project!.id}`)} className="hover:text-lightTeal transition-all duration-100 hover:cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </div>
                        <div className="font-display text-4xl uppercase text-lightTeal">{project!.name}</div>
                    </div>
                    <div className="w-full flex flex-col px-12 gap-y-5 py-3 mb-16">
                        {projectUpdates?.data.map((update, updateIndex) => {
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
                                        <p className="text-lightTeal mb-2 text-xl">{update.date}</p>
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

                                    <div>{update.date}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 mt-10">
                        <Pagination handleNextPage={handleNextPage} handlePreviousPage={handlePreviousPage} currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
                    </div>
                </div>)}
        </div>
    )
}

export default UpdateGallery