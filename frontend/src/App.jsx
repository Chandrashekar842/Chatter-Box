import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RegisterPage } from './pages/Registerpage'
import { LoginPage } from './pages/Login'

const router = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
