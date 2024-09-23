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
    return (
        <div>
            <p className='text-offWhite'>{user?.username}</p>

            {userProjects.length > 0 ? (
                userProjects.map((project) => (
                    <p key={project.id}>{project.name}</p>
                ))
            ) : (
                <p>Add your first project to begin!</p>
            )}

            <button className='text-offWhite' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Feed