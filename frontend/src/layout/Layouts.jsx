import React from 'react'
// import Header from '../Header'
import { Outlet } from 'react-router-dom'
// import Footer from '../Footer'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Layouts = () => {
    return (
        <>
            <Header />
            <main className='min-h-screen'>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layouts
