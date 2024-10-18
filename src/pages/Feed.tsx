import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore'
import { useEffect, useState } from 'react';
import { getProjectsByUser, togglePriority, updateAndGetCurrentStreak } from '../services/projectService';
import useErrorStore from '../store/useErrorStore';
import AddProjectButton from '../components/AddProjectButton';
import { useQueries, useQuery } from '@tanstack/react-query';
import AddUpdatePopup from '../components/AddUpdatePopup';
import { createShortUpdate } from '../services/updateService';
import useFormValidation from '../hooks/useFormValidation';
import { getLevelOptions, getTechniquesOptions } from '../services/selectorService';
import Select from 'react-select'
import { reactSelectStyles } from '../utils/reactSelectStyles';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

type Project = {
    id: number,
    name: string,
    image: string,
    priority: boolean,
    userProjectId: number,
    updatedToday: boolean
};

interface UserProjects {
    total: number,
    data: Array<Project>
}

interface SearchData {
    search: string,
    technique?: number,
    level?: number,
    priority?: number
}

interface Option {
    id: number,
    label: string
}

const Feed = () => {
    const token = localStorage.getItem('authToken');
    const user = useUserStore((state) => state.user);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const setError = useErrorStore((state) => state.setError);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToUpdate, setProjectToUpdate] = useState(0);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);

    const initialSearchData: SearchData = {
        search: ""
    };

    const { formValues, handleInputChange, handleReactSelectChange } = useFormValidation(initialSearchData)

    useEffect(() => {
        const loadUser = async () => {
            if (token && !user) {
                try {
                    await fetchUser();
                }
                catch (error) {
                    navigate('/login');
                }
            }
        }
        loadUser();
    }, [token, user, fetchUser, navigate]);

    const { data: userProjects, error: projectsError, refetch, isLoading } = useQuery<UserProjects>({
        queryKey: ['projectsByUser', user?.username],
        queryFn: () => getProjectsByUser({ ...formValues, page: currentPage }),
        enabled: !!user,
    })

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            goToPage(1);
            refetch();
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [formValues])

    // PAGINATION
    const [totalProjects, setTotalProjects] = useState(0);

    const { currentPage, totalPages, goToPage, handleNextPage, handlePreviousPage } = usePagination(totalProjects);

    useEffect(() => {
        const setPaginationTotalProjects = () => {
            userProjects && setTotalProjects(userProjects.total);
        }

        setPaginationTotalProjects();
    }, [userProjects])

    useEffect(() => {
        refetch();
    }, [currentPage])

    const [{ data: levelOptions, error: levelError },
        { data: techniqueOptions, error: statusError }
    ] = useQueries({
        queries: [
            {
                queryKey: ['levelOptions'],
                queryFn: () => getLevelOptions(),
            },
            {
                queryKey: ['techniqueOptions'],
                queryFn: () => getTechniquesOptions()
            }
        ]
    }) as [{ data: Option[] | undefined, error: Error },
            { data: Option[] | undefined, error: Error }]


    [levelError, statusError, projectsError].map(error => {
        if (error instanceof Error) {
            setError(error?.message)
        }
    });

    const handleAddUpdate = async (event: React.MouseEvent, projectId: number) => {
        event.stopPropagation();
        let currentStreak = await updateAndGetCurrentStreak();
        setCurrentStreak(currentStreak);
        setProjectToUpdate(projectId);
        setIsModalOpen(true);
    }

    const sendShortUpdate = async () => {
        await createShortUpdate(projectToUpdate);
        setIsModalOpen(false);
        setProjectToUpdate(0);
        refetch();
        goToPage(1);
    }

    const handleTogglePriority = async (event: React.MouseEvent, userProjectId: number) => {
        event.stopPropagation();
        try {
            await togglePriority(userProjectId);
            refetch();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }


    const handleGoToProject = (projectId: number) => {
        navigate(`/project/${projectId}`);
    }

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className='flex flex-col'>
                    <div className='flex ps-10 mb-5 justify-center gap-x-3'>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search"
                            value={formValues?.search}
                            onChange={handleInputChange}
                            maxLength={100}
                            className='w-1/2 h-10 rounded-md font-display px-3 text-lightTeal bg-darkGrey border border-lightTeal'
                        />
                        <div
                            className='w-1/12 bg-darkTeal flex items-center justify-center rounded-md font-display text-offWhite uppercase text-lg  inner-border-offWhite hover:cursor-pointer'
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        >Filters</div>
                    </div>

                    {
                        isFiltersOpen && (
                            <div className='text-offWhite flex justify-center gap-x-3 mb-5'>
                                <div className='w-1/4'>
                                    <Select
                                        options={levelOptions}
                                        onChange={handleReactSelectChange('level')}
                                        value={levelOptions?.find(option => option.id === formValues.level)}
                                        unstyled
                                        classNames={reactSelectStyles}
                                        isClearable
                                    />
                                </div>

                                <div className='w-1/4'>
                                    <Select
                                        options={techniqueOptions}
                                        onChange={handleReactSelectChange('technique')}
                                        value={techniqueOptions?.find(option => option.id === formValues.technique)}
                                        unstyled
                                        classNames={reactSelectStyles}
                                        isClearable
                                    />
                                </div>

                            </div>
                        )
                    }

                    {
                        userProjects && userProjects.data.length > 0 ? (
                            <div>
                                <div className='flex ms-10 gap-x-5 gap-y-5 flex-wrap justify-center'>
                                    {userProjects.data.map((project) => (
                                        <div
                                            key={project.id}
                                            className='lg:w-1/6 md:w-1/4 sm:w-1/3 aspect-square bg-cover bg-center rounded-xl relative transition-all duration-300 ease-in-out hover:outline hover:outline-lightTeal hover:outline-1 hover:cursor-pointer'
                                            style={{ backgroundImage: `url(${project.image})` }}
                                            onClick={() => handleGoToProject(project.id)}
                                        >
                                            <button onClick={(e) => handleTogglePriority(e, project.userProjectId)} className='text-lightTeal absolute right-3 top-3'>
                                                {project.priority ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 transitition-all ease-in-out duration-300 hover:fill-none hover:stroke-lightTeal hover:stroke-1">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 transitition-all ease-in-out duration-300 hover:fill-current">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                    </svg>

                                                )}
                                            </button>


                                            <div className='absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full h-1/6 flex items-end justify-between rounded-xl'>
                                                <p className='text-offWhite font-display ps-3 pb-1' >{project.name}</p>
                                                {project.updatedToday ? (
                                                    <div className='text-lightTeal pb-2 pe-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>

                                                ) : (
                                                    <button
                                                        onClick={(e) => handleAddUpdate(e, project.id)}
                                                        className='text-lightTeal pb-2 pe-2 group'>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="size-6 transition-colors duration-200 group-hover:text-offWhite">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-5 fixed bottom-10 left-1/2 transform -translate-x-1/2">
                                    <Pagination
                                        handleNextPage={handleNextPage}
                                        handlePreviousPage={handlePreviousPage}
                                        currentPage={currentPage}
                                        goToPage={goToPage}
                                        totalPages={totalPages}
                                    />
                                </div>

                            </div>
                        ) : (
                            <p>Add your first project to begin!</p>
                        )
                    }

                    <AddProjectButton />
                    <AddUpdatePopup isOpen={isModalOpen} onClose={sendShortUpdate} projectId={projectToUpdate} currentStreak={currentStreak}></AddUpdatePopup>

                </div >)}
        </div >
    )
}

export default Feed