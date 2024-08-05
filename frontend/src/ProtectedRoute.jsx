import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {

  const navigate = useNavigate()
  const token = localStorage.getItem('chatterBoxToken')
  
  useEffect(() => {
    if(token === null) {
      navigate('/login', { replace: true })
    }
  }, [ token,navigate ])

  return children
}