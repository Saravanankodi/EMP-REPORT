import React from 'react'

interface bannerProps {
    date?: string,
    report:string
}
const Banner:React.FC<bannerProps> = ({date,report}) => {
  return (
    <>
    <section className="w-full h-[50px] flex items-center  border border-[#0496ff] rounded-xl ">
      <span className="text text-base w-[150px] h-auto text-center ">
        {date}
      </span>
      <main className='w-full h-full bg-[#D9D9D9] flex items-center rounded-e-xl'>
      <p className="text text-base mx-5">
        {report}
      </p>
      </main>
    </section>
    </>
  )
}

export default Banner