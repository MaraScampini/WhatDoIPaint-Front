import { useNavigate } from "react-router-dom"

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <div className='w-screen px-5 py-3 flex items-center justify-between'>
            <p className='font-display text-white hover:cursor-pointer' onClick={() => navigate('/feed')}>
                <span className='text-3xl'>W</span>
                <span className='text-sm'>d</span>
                <span className='text-3xl'>IP</span>
            </p>

            <div className='relative w-[30px] h-30 rounded-full overflow-hidden text-lightTeal'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                {/* TODO: put profile picture from the user
                <img src="/assets/profile.png" alt="profile-picture" className='w-full h-full object-cover' />
                <div className="absolute inset-0 bg-darkTeal rounded-full mix-blend-hue"></div> */}
            </div>
        </div>
    )
}

export default NavBar