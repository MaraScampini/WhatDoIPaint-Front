import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore'
import { useEffect, useState } from 'react';
import { getProjectsByUser } from '../services/projectService';

type Project = {
    id: number,
    name: string,
    image: string,
    isPriority: boolean
};

const Feed = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const navigate = useNavigate();

    const [userProjects, setUserProjects] = useState<Project[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
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

    return (
        <div>
            <p className='text-offWhite'>{user?.username}</p>

            {userProjects.length > 0 ? (
                <div className='flex ms-10 space-x-5'>
                    {userProjects.map((project) => (
                        <div
                            key={project.id}
                            className='w-1/4 aspect-square bg-cover bg-center rounded-xl relative'
                            style={{ backgroundImage: `url(${project.image})` }}
                        >
                            {project.isPriority && (
                                <div className='text-lightTeal absolute right-3 top-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                </div>

                            )}

                            <div className='absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full h-1/6 flex items-end justify-between rounded-xl'>
                                <p className='text-offWhite font-display ps-3 pb-1' >{project.name}</p>
                                <button
                                    onClick={handleAddUpdate}
                                    className='text-lightTeal pb-1 pe-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
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
        </div>
    )
}

export default Feed