import React from 'react'
import { Input } from '../base/Input'
import { Button } from '../base/Button'

function LoginForm() {

  return (
    <>
    <section className="w-full h-full p-5">
        <header className="w-full h-auto p-2">
            <h2 className="heading text-3xl my-3 text-center">
                ADMIN LOGIN
            </h2>
            <p className="text text-[18px]">
                Login with your <span className="text-[#0496ff]">admin</span> credential.
            </p>
        </header>
        <form className="w-full flex flex-col gap-5 items-center justify-center">
            <Input type='email' placeholder='Enter username...' />
            <Input type='password' placeholder='Enter password...'/>
            <Button variant={'primary'} type='submit' className='w-full h-10 rounded-full'>LOGIN</Button>
        </form>
    </section>
    </>
  )
}

export default LoginForm