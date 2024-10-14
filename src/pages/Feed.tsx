import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore'
import { useEffect, useState } from 'react';
import { getProjectsByUser, togglePriority } from '../services/projectService';
import useErrorStore from '../store/useErrorStore';
import AddProjectButton from '../components/AddProjectButton';
import { useQuery } from '@tanstack/react-query';
import AddUpdatePopup from '../components/AddUpdatePopup';
import { createShortUpdate } from '../services/updateService';

type Project = {
    id: number,
    name: string,
    image: string,
    priority: boolean,
    userProjectId: number,
    updatedToday: boolean
};

const Feed = () => {
    const token = localStorage.getItem('authToken');
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const setError = useErrorStore((state) => state.setError);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToUpdate, setProjectToUpdate] = useState(0);


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

    const { data: userProjects = [], error, refetch } = useQuery<Project[]>({
        queryKey: ['projectsByUser', user?.username],
        queryFn: () => getProjectsByUser(),
        enabled: !!user,
    })

    if (error) setError(error.message);

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const handleAddUpdate = (event: React.MouseEvent, projectId: number) => {
        event.stopPropagation();
        setProjectToUpdate(projectId);
        setIsModalOpen(true);
        console.log('Painted today!')
    }

    const sendShortUpdate = async () => {
        // TODO
        await createShortUpdate(projectToUpdate);
        console.log('Short Update on project ' + projectToUpdate)
        setIsModalOpen(false);
        setProjectToUpdate(0);
        refetch();
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
            <p className='text-offWhite'>{user?.username}</p>

            {userProjects.length > 0 ? (
                <div className='flex ms-10 gap-x-5 gap-y-5 flex-wrap'>
                    {userProjects.map((project) => (
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
            ) : (
                <p>Add your first project to begin!</p>
            )
            }

            <button className='text-offWhite' onClick={handleLogout}>Logout</button>
            <AddProjectButton />
            <AddUpdatePopup isOpen={isModalOpen} onClose={sendShortUpdate} projectId={projectToUpdate}></AddUpdatePopup>

        </div >
    )
}

export default Feed