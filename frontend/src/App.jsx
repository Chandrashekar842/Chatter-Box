import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RegisterPage } from './pages/Registerpage'
import { LoginPage } from './pages/Login'
import { Homepage } from './pages/Homepage'
import { ProtectedRoute } from './ProtectedRoute'
import { NotFoundPage } from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    ), 
    errorElement: <NotFoundPage />
  }
])

function App() {

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
