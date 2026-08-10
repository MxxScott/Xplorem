import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="bg-[#161C26] border border-[#1C365D]/30 backdrop-blur-xl shadow-[0_1_2_rgba(0,0,0,0.5)] sticky top-0 z-50 flex justify-between w-full h-fit">
      <div className="gap-[auto] w-full h-16 px-6 flex flex-row items-center">
        <div className="flex flex-row gap-8 w-fit h-fit justify-start items-center">
          <span className="text-[#A3C9FF] font-bold font-sora text-2xl leading-6 tracking-[-0.6px] text-left">
            Xplorem
          </span>
          <nav className="flex flex-row gap-6 w-fit h-fit justify-start">
            <Link
              to="/"
              className="text-[#A3C9FF] border-b-2 border-b-[#A3C9FF] pb-1 flex items-center leading-6 text-[16px] font-bold"
            >
              Browse
            </Link>
            <Link
              to="/library"
              className="text-[#C0C7D5] flex items-center leading-6 text-[16px] font-bold"
            >
              Library
            </Link>
            <Link
              to="/news"
              className="text-[#C0C7D5] flex items-center leading-6 text-[16px] font-bold"
            >
              News
            </Link>
          </nav>
        </div>
        <div className="flex flex-row gap-4 items-center ">
          <div className="w-[256px] h-8.5 flex justify-center py-1.75 pl-10 pr-4 relative">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search titles..."
              className="w-[256px] h-8.5 text-[#6B7280] bg-[#161C26] rounded-4xl border-[#1C365D]/50 border"
            />
            <span className='absolute left-3 top-1.75 h-5 '>
              <svg xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.68333 10.5L6.00833 6.825C5.71667 7.05833 5.38125 7.24306 5.00208 7.37917C4.62292 7.51528 4.21944 7.58333 3.79167 7.58333C2.73194 7.58333 1.83507 7.21632 1.10104 6.48229C0.367014 5.74826 0 4.85139 0 3.79167C0 2.73194 0.367014 1.83507 1.10104 1.10104C1.83507 0.367014 2.73194 0 3.79167 0C4.85139 0 5.74826 0.367014 6.48229 1.10104C7.21632 1.83507 7.58333 2.73194 7.58333 3.79167C7.58333 4.21944 7.51528 4.62292 7.37917 5.00208C7.24306 5.38125 7.05833 5.71667 6.825 6.00833L10.5 9.68333L9.68333 10.5ZM3.79167 6.41667C4.52083 6.41667 5.14062 6.16146 5.65104 5.65104C6.16146 5.14062 6.41667 4.52083 6.41667 3.79167C6.41667 3.0625 6.16146 2.44271 5.65104 1.93229C5.14062 1.42188 4.52083 1.16667 3.79167 1.16667C3.0625 1.16667 2.44271 1.42188 1.93229 1.93229C1.42188 2.44271 1.16667 3.0625 1.16667 3.79167C1.16667 4.52083 1.42188 5.14062 1.93229 5.65104C2.44271 6.16146 3.0625 6.41667 3.79167 6.41667Z"
                  fill="#C0C7D5"
                />
              </svg>
            </span>
          </div>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );  
}

export default Navbar
