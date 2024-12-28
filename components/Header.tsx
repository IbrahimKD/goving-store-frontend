import React from 'react'

type Props = {}

const Header = (props: Props) => {
  return (
    <header className='w-full py-3 bg-black shadow-sm shadow-gray-400 flex justify-between items-center px-16'>
        <h1>Next.js 15</h1>
        <nav className='flex gap-5 justify-between items-center '>
            <ul className='flex items-center gap-4'>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <button className='px-3 py-2 text-sm rounded-md text-white border border-white hover:bg-white transition-all hover:text-black'>Login</button>
            <button className='px-3 py-2 text-sm rounded-md text-white border border-white hover:bg-white transition-all hover:text-black'>Sign Up</button>
        </nav>
    </header>
)
}

export default Header