"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Register() {

    const [data , setData] = useState({
       name : "",
        email : "",
        password : ""
    })

    const router = useRouter();
    const [error , SetError] = useState({})

    const handleErrors  =  () => {
    const error = {};
  const {name  , email , password} = data;
let regex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!regex.test(email.trim())){
        error.email = "Please fill correct email";
    }
     if(name.trim().length <= 2){
        error.password = "Please fill correct name"
    }
    if(password.length <= 5){
        error.password = "password should be atleast 5 character"
    }
    return error
    }

    const handleInput = (e) => {
    const {name , value} = e.target;

    setData((prev) => ({...prev , [name] : value}))
    }

    const handleSubmit = async(e) => {
    e.preventDefault();

    const hasError = handleErrors();

    if(Object.keys(hasError).length){
        SetError(hasError)
        return
    }
SetError({})

 const {email , name , password} = data;
  try {
   const response = await fetch("/api/register",
    { method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password , name }),}
   );

    if (response.ok) {
      router.push("/login");
    } else {
      const data = await response.json();
      throw new Error("Signup failed");
    }
    } catch (error) {
            console.log( error.message);
        }
    // console.log(data)
    }

  return (
    <>
      
      <div className="flex h-dvh flex-col justify-center px-6 py-12 lg:px-8 bg-purple-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black"> Sign Up to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
             <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
               Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={data.name}
                  onChange={handleInput}
                  autoComplete="name"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleInput}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium  text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={data.password}
                    onChange={handleInput}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 border text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </form>

    
        </div>
      </div>
    </>
  )
}
