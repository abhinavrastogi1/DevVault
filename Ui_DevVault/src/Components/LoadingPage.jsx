
const  LoadingPage=()=>{

    return (
<>
<div className="h-screen w-full flex justify-center items-center bg-black ">

    <div className="">
  <div className="relative  flex items-center justify-center transition transform duration-2000 lg:translate-x-70 translate-x-50 ">
    {/* Ring spinner */}
    <div className="absolute w-20 h-20  lg:w-40 lg:h-40  border-2 rounded-full lg:border-[6px] border-gray-300 border-r-purple-500  animate-spin">
    </div>
    {/* Logo */}
    <div className="  w-10 h-10 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center ">
      <svg viewBox="0 0 24 24" fill="none" className="  w-7 h-7 lg:w-10 lg:h-10 text-white" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2L12 4" />
        <path d="M12 20L12 22" />
        <path d="M2 12L4 12" />
        <path d="M20 12L22 12" />
        <path d="M4.93 4.93L6.34 6.34" />
        <path d="M17.66 17.66L19.07 19.07" />
        <path d="M4.93 19.07L6.34 17.66" />
        <path d="M17.66 6.34L19.07 4.93" />
      </svg>
    </div>
    </div>
  </div>
  <div className="  text-white  font-extrabold text-3xl lg:text-7xl ml-7 lg:ml-14 transition transform duration-2000  lg:-translate-x-60 -translate-x-10 ">
        DevVault
    </div>
</div>

</>
    )
}
export default LoadingPage