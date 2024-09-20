import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const Landing = () => {
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  useEffect(() => {
    if (token) { navigate('/feed') };
  }, [token, navigate]);

  return (
    <div className='w-full flex-1 flex flex-col px-20 py-10'>
      <p className='font-display text-4xl'>
        <span className='text-offWhite'>Welcome to </span>
        <span className='text-lightTeal font-bold'>What Do I Paint?</span>
      </p>

      <div className='w-3/4 flex flex-col space-y-10 mt-10'>
        <p className='font-display text-xl text-offWhite'>
          We know, you have a few projects you’re working on, some things get forgotten, you’re in the middle of so many things you don’t know what to do next...
        </p>
        <p className='font-display text-xl text-offWhite'>
          Don’t worry! We are here to help you track everything you have going on and keep you motivated to paint every day (or week, if life gets in the way).
        </p>
        <p className='font-display text-xl text-offWhite'>
          Add your first project and start your painting streak today! Upload pictures, get a personalized feed for each project and see your pile of shame get smaller (hopefully).
        </p>
        <p className='font-display text-xl text-offWhite'>
          When you have a few things in the mix we can help you choose what to paint next. You tell us some general idea of what you want and we will choose between your ongoing projects! And don’t worry, you can always re-roll until you get that project that you know you actually want to paint.
        </p>
      </div>

      <p className='font-display text-2xl pt-10'>
        <Link to="/login">
          <span className='text-lightTeal underline'>Login</span>
        </Link>
        <span className='text-offWhite'> to begin</span>
      </p>
    </div>
  )
}

export default Landing