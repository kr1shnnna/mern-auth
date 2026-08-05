import {assets} from '../assets/assets.js'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img}   
      width={112}
    height={112}
    className="object-contain mb-6"/>

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Stranger 
        <img  className='w-8 aspect-square'
      src={assets.hand_wave}/></h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome Back</h2>
      <p className='mb-8 max-w-md '>Sign in to securely access your account and continue your journey. </p>
      
      <button
  className="
    px-8 py-3
    rounded-full
    bg-white/10
    backdrop-blur-md
    border border-white/30
    text-white
    font-medium
    shadow-lg
    hover:bg-white/20
    hover:scale-105
    transition-all
    duration-300
  "
>
  Get Started →
</button>

    </div>
  )
}

export default Header
