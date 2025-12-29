import { useState } from 'react'
import { Input } from '../base/Input'
import { Button } from '../base/Button'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore";
import { auth,db } from '../../lib/firebase'

function LoginForm() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth,email,password)
            console.log("Login success:", res.user.uid);
            const userDoc = await getDoc(doc(db, "users", res.user.uid));
            const role = userDoc.data()?.role;

            if (role === "admin") navigate("/admin");
            else navigate("/user");
            const token = await res.user.getIdTokenResult();
            console.log("CUSTOM CLAIMS:", token.claims);
        }
        catch (err) {
            console.error(err);
            setError("Invalid credentials");
          }
    };

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
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5 items-center justify-center">
            <Input type='email' placeholder='Enter username...' onChange={e=>{setEmail(e.target.value)}} />
            <Input type='password' placeholder='Enter password...' onChange={e=>{setPassword(e.target.value)}}/>
            <Button variant={'primary'} type='submit' className='w-full h-10 rounded-full'>LOGIN</Button>
            {error && <p>{error}</p>}
        </form>
    </section>
    </>
  )
}

export default LoginForm