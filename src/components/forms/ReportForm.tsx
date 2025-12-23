import React from 'react'
import { Input } from '../base/Input'
import { Button } from '../base/Button'

function ReportForm() {
  return (
    <>
    <section className="w-full h-fit m-auto border py-2 px-4 sm:py-5 sm:px-10 rounded-2xl sm:flex items-baseline-last justify-evenly gap-5 ">
      <Input
      label='Start-Time'
      type='time'
      className='max-w-[300px]'
      />
      <Input
      label='End-Time'
      type='time'
      className='max-w-[300px]'
      />
      <Input
      label='Description'
      type='text'
      placeholder='Description'
      className='max-w-[300px]'
      />
      <Button variant={'primary'} className='rounded-xl w-1/2 text-nowrap text-2xl'>Add Report</Button>
    </section>
    </>
  )
}

export default ReportForm