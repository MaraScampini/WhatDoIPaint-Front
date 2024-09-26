import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore'
import { useEffect, useState } from 'react';
import { getProjectsByUser, togglePriority } from '../services/projectService';
import useErrorStore from '../store/useErrorStore';
import AddProjectButton from '../components/AddProjectButton';

type Project = {
    id: number,
    name: string,
    image: string,
    priority: boolean,
    userProjectId: number
};

const Feed = () => {
    const token = localStorage.getItem('authToken');
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const navigate = useNavigate();

    const [userProjects, setUserProjects] = useState<Project[]>([]);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                if (!user) {
                    await fetchUser(token);
                }
                const userProjects = await getProjectsByUser(token);
                setUserProjects(userProjects);
            } else {
                navigate('/login');
            }
        }
        loadUser();
    }, []);


    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const handleAddUpdate = () => {
        // TODO
        console.log('Painted today!')
    }

    const handleTogglePriority = async (userProjectId: number) => {
        try {
            await togglePriority(token!, userProjectId);
            const userProjects = await getProjectsByUser(token!);
            setUserProjects(userProjects);
        } catch (error) {
            if (error instanceof Error) {
                useErrorStore.getState().setError(error.message);
            }
        }
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
                        >
                            <button onClick={() => handleTogglePriority(project.userProjectId)} className='text-lightTeal absolute right-3 top-3'>
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
                                <button
                                    onClick={handleAddUpdate}
                                    className='text-lightTeal pb-1 pe-1 group'>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6 transition-colors duration-200 group-hover:text-offWhite">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Add your first project to begin!</p>
            )}

            <button className='text-offWhite' onClick={handleLogout}>Logout</button>
            <AddProjectButton/>
        </div>
    )
}

export default Feed