// import React from 'react'

import FillterForm from "../components/forms/FillterForm"
import Header from "../components/layout/Header"
import Reports from "../components/layout/Reports"

const Admin = () => {
  return (
    <>
    <section className="w-full h-auto px-5 sm:px-10 grid gap-5">
      <Header Name="Saravana Kodi"/>
      <FillterForm/>
      <Reports/>
    </section>
    </>
  )
}

export default Admin