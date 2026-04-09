import Approutes from './routes/Approutes'
import { AuthProvider } from './context/Authcontext'
const App = () => {
  return (
    <>

      <AuthProvider>
        <Approutes />
      </AuthProvider>


    </>
  )
}

export default App
