import React from 'react'

interface bannerProps {
    date?: string,
    report:string
}
const Banner:React.FC<bannerProps> = ({date,report}) => {
  return (
    <>
    <section className="w-full h-auto max-sm:min-w-full min-h-12.5 flex items-center  border border-[#0496ff] rounded-xl ">
      <span className="text text-base w-37.5 h-auto text-center ">
        {date}
      </span>
      <p className='w-full h-full min-h-12.5 p-1 bg-[#D9D9D9] flex items-center rounded-e-xl text text-base text-wrap'>
          {report}
      </p>
    </section>
    </>
  )
}

export default Banner