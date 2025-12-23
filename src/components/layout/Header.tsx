import React from 'react'
import logo from "../../assets/desflyer.png"
import { Button } from '../base/Button'
import icon from '../../assets/logout.png'
interface headerProps{
    Name?:string
}
export const Header:React.FC<headerProps>=({Name})=> {
  return (
    <>
    <section className="w-full h-auto m-auto">
        <header className="block w-fit m-auto">
            <img src={logo} alt="" className="w-auto h-auto" />
        </header>
        <main className="w-full h-auto grid sm:grid-cols-3 items-center">
            <p className="w-fit text text-xl text-[#0496ff] border border-[#0496ff] bg-[#0496FF12
] py-5 px-10 rounded-xl ">
                {Name} hello world
            </p>
            <h2 className="heading text-center text-4xl">
                Daily Report System
            </h2>
            <Button variant={'secoundary'} className='w-fit justify-self-end-safe'>
                <img src={icon} alt="" className="w-auto h-auto" />
                Logout
            </Button>
        </main>
    </section>
    </>
  )
}
export default Header