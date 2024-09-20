import useUserStore from '../store/useUserStore'

const Feed = () => {
    const user = useUserStore((state) => state.user)
    return (
        <div>
            <p className='text-offWhite'>{user?.username}</p>
        </div>
    )
}

export default Feed