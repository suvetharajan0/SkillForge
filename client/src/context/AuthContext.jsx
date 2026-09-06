import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'


const AuthContext = createContext()


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  // On app load, check if a token exists and is still valid
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }


    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])


  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    return res.data
  }


  const register = async (name, email, password, techStack) => {
    const res = await api.post('/auth/register', { name, email, password, techStack })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    return res.data
  }


  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }
   
  const refreshUser = async () => {
    const res = await api.get('/auth/me')
    setUser(res.data)
    return res.data
  }


  return (
      <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
