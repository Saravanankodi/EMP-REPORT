// import React from 'react'
import logo from "../../assets/desflyer.png"
import { Button } from '../base/Button'
import icon from '../../assets/logout.png'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const Header =()=> {
    const {logout,currentUser } = useAuth();
    const navigate = useNavigate();
    const name = currentUser?.name;
    const handleLogout = async () => {
        await logout();
        navigate("/login");
      };

  return (
    <>
    <section className="w-full h-auto m-auto">
        <header className="block w-fit m-auto">
            <img src={logo} alt="" className="w-auto h-auto" />
        </header>
        <main className="w-full h-auto grid grid-cols-2 grid-row-2 max-sm:place-items-center sm:grid-cols-3 items-center">
            <p className="w-fit text sm:text-xl text-[#0496ff] text-sm max-sm:row-start-2 max-sm:row-end-3 border border-[#0496ff] bg-[#0496FF12
] px-5 py-2.5 sm:py-5 sm:px-10 rounded-lg sm:rounded-xl ">
                {name}
            </p>
            <h2 className="heading text-center text-2xl sm:text-4xl max-sm:col-start-1 max-sm:col-end-3">
                Daily Report System
            </h2>
            <Button variant={'secoundary'} onClick={handleLogout} className='w-fit text-base max-sm:row-start-2 max-sm:row-end-3 sm:justify-self-end-safe'>
                <img src={icon} alt="" className="w-auto h-auto" />
                Logout
            </Button>
        </main>
    </section>
    </>
  )
}
export default Header