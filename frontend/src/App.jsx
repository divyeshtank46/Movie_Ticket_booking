import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layouts from './layout/Layouts'
import Login from './components/Login'
import Regestraion from './components/Regestraion'
import { ToastContainer } from 'react-toastify'
import ContactUs from './pages/Contact'
import Approutes from './routes/Approutes'
import { AuthProvider } from './context/Authcontext'

const App = () => {
  return (
    <div>

      <AuthProvider>
        <Approutes />
      </AuthProvider>


    </div>
  )
}

export default App
