import { Input } from '../base/Input'
import { Button } from '../base/Button'
import React, { useState } from 'react'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {auth,db} from '../../lib/firebase'


function ReportForm() {
  const [startTime,setStartTime]=useState('');
  const [endTime,setEndTime] = useState('');
  const [disc,setDisc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // const isTimeInvalid = startTime >= endTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (submitting) return;
    if (!auth.currentUser) return;
    if (startTime >= endTime) {
      alert("Start time must be earlier than end time");
      return;
    }
    try {
      setSubmitting(true);
  
      const reportsRef = collection(db, "reports");
  
      await addDoc(reportsRef, {
        userId: auth.currentUser.uid,
        timeStart: startTime,
        timeEnd: endTime,
        report: disc,
        status: "pending",
        submittedAt: serverTimestamp(),
      });
  
      setStartTime('');
      setEndTime('');
      setDisc('');
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
    <form onSubmit={handleSubmit} className="w-full h-fit m-auto border py-2 px-4 sm:py-5 sm:px-10 rounded-2xl flex flex-col sm:flex-row items-center sm:items-baseline-last justify-center sm:justify-evenly gap-5 ">
      <Input
      label='Start-Time'
      type='time'
      value={startTime}
      onChange={e=>{setStartTime(e.target.value)}}
      className='max-w-75 text-base'
      />
      <Input
      label='End-Time'
      type='time'
      value={endTime}
      onChange={e=>{setEndTime(e.target.value)}}
      className='max-w-75 text-base'
      />
      <Input
      label='Description'
      type='text'
      placeholder='Description'
      value={disc}
      onChange={e=>{setDisc(e.target.value)}}
      className='max-w-75 text-base'
      />
      <Button
        type="submit"
        variant="primary"
        disabled={
          submitting ||
          !startTime ||
          !endTime ||
          !disc
        }
        className="rounded-xl w-1/2 text-nowrap text-2xl"
      >
        {submitting ? "Submitting..." : "Add Report"}
      </Button>
      {/* {startTime && endTime && startTime >= endTime && (
        <p className=" absolute top-10 bg-white w-auto p-2 rounded-xl border border-[#0496ff] text-2xl text-red-500">
          Start time must be earlier than end time
        </p>
      )} */}

    </form>
    </>
  )
}

export default ReportForm