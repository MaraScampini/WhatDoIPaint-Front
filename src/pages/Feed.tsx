import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore'
import { useEffect } from 'react';

const Feed = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const loadUser = async () => {
            if (token && !user) {
                await fetchUser(token);
            }
        }
        loadUser();
    }, [fetchUser, user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    }
    return (
        <div>
            <p className='text-offWhite'>{user?.username}</p>

            <button className='text-offWhite' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Feed