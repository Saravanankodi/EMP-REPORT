import { Input } from '../base/Input'
import { Button } from '../base/Button'
import React, { useState } from 'react'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {auth,db} from '../../lib/firebase'


function ReportForm() {
  const [startTime,setStartTime]=useState('');
  const [endTime,setEndTime] = useState('');
  const [disc,setDisc] = useState('');

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();
    
  try {
    if (!auth.currentUser) return;

    // Reference to 'reports' collection
    const reportsRef = collection(db, "reports");

    // Add new report
    await addDoc(reportsRef, {
      userId: auth.currentUser.uid,
      // name: auth.currentUser.email,
      timeStart: startTime,
      timeEnd: endTime,
      report:disc,
      submittedAt: serverTimestamp(),
    });

    console.log("Report submitted successfully!");
    setStartTime('')
    setEndTime('')
    setDisc('')
  } catch (error) {
    console.error("Error submitting report:", error);
  }
  }
  return (
    <>
    <form onSubmit={handleSubmit} className="w-full h-fit m-auto border py-2 px-4 sm:py-5 sm:px-10 rounded-2xl flex flex-col sm:flex-row items-center sm:items-baseline-last justify-center sm:justify-evenly gap-5 ">
      <Input
      label='Start-Time'
      type='time'
      value={startTime}
      onChange={e=>{setStartTime(e.target.value)}}
      className='max-w-[300px] text-base'
      />
      <Input
      label='End-Time'
      type='time'
      value={endTime}
      onChange={e=>{setEndTime(e.target.value)}}
      className='max-w-[300px] text-base'
      />
      <Input
      label='Description'
      type='text'
      placeholder='Description'
      value={disc}
      onChange={e=>{setDisc(e.target.value)}}
      className='max-w-[300px] text-base'
      />
      <Button type='submit' variant={'primary'} className='rounded-xl w-1/2 text-nowrap text-2xl'>Add Report</Button>
    </form>
    </>
  )
}

export default ReportForm