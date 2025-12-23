import React from 'react'
import Banner from '../base/Banner'

function Reports() {
  return (
    <>
    <section className="w-full h-auto">
        <h2 className="heading text-center text-4xl">
            Report History
        </h2>
        <table className="w-full h-auto m-auto my-5">
            <thead className="border">
                <tr>
                    <th className="w-1/5 text-2xl heading border">Date</th>
                    <th className="w-3/5 text-2xl heading border">Entries</th>
                    <th className="w-1/5 text-2xl heading border">Actions</th>
                </tr>
            </thead>
            <tbody className='border'>
                <tr>
                    <td className="text text-center border">
                        21-12-2025
                    </td>
                    <td className="text grid gap-2.5 p-2.5 border">
                        <Banner date='20:20 — 23:20' report='Hello Sir,All work done Today'/>
                        <Banner date='20:20 — 23:20' report='Hello Sir,All work done Today'/>
                        <Banner date='20:20 — 23:20' report='Hello Sir,All work done Today'/>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
    </>
  )
}

export default Reports