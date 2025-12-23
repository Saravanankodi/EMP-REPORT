import React from 'react'
import Header from '../components/layout/Header'
import ReportForm from '../components/forms/ReportForm'
import History from '../components/layout/History'

function User() {
  return (
    <>
    <section className="w-full h-auto px-10 grid gap-5">
        <Header
        Name='Haran hari'/>
        <ReportForm/>
        <History/>
    </section>
    </>
  )
}

export default User