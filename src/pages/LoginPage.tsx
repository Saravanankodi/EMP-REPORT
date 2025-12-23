import React from 'react'
import bgImg from '../assets/bg.png'
import logo from '../assets/logo.png'
import LoginForm from '../components/forms/LoginForm'
function LoginPage() {
  return (
    <>
    <section className="w-full h-screen overflow-hidden flex items-center justify-center m-auto">
        <aside className="w-3/5 h-full m-auto">
            <img src={bgImg} alt="" className='h-auto w-full' />
        </aside>
        <main className="w-2/5 h-full flex flex-col items-center justify-center gap-5">
            <header className="w-full h-fit m-auto">
                <img src={logo} alt="" className='block w-1/2 h-auto m-auto ' />
            </header>
            <LoginForm/>
        </main>
    </section>
    </>
  )
}

export default LoginPage