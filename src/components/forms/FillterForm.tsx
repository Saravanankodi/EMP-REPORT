import React from 'react'
import { Input } from '../base/Input'
import { Button } from '../base/Button'

function FillterForm() {
  return (
    <>
    <section className="w-full h-fit m-auto border py-2 px-4 sm:py-5 sm:px-10 rounded-2xl sm:grid grid-cols-4 grid-rows-2 items-baseline-last justify-evenly gap-5 ">
      <Input
      label='Employee ID'
      type='text'
      placeholder='DF001'
      className='max-w-[300px]'
      />
      <Input
      label='Week'
      type='week'
      className='max-w-[300px]'
      />
      <Input
      label='Month'
      type='month'
      className='max-w-[300px]'
      />
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
      <Button variant={'primary'} className='rounded-xl col-start-4 col-end-4 row-start-1 row-end-3 m-auto w-1/2 text-nowrap text-2xl  '>Search Range</Button>
    </section>
    </>
  )
}

export default FillterForm