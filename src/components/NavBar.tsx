
const NavBar = () => {
    return (
        <div className='w-screen px-5 py-3 flex items-center justify-between'>
            <p className='font-display text-white'>
                <span className='text-3xl'>W</span>
                <span className='text-sm'>d</span>
                <span className='text-3xl'>IP</span>
            </p>

            <div className='w-[30px] h-30 rounded-full overflow-hidden'>
                <img src="/assets/test-profile.jpg" alt="profile-picture" className='w-full h-full object-cover' />
            </div>
        </div>
    )
}

export default NavBar