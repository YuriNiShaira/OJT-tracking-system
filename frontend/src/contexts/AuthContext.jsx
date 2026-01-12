import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios' 
import api from '../utils/api'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () =>{
        try{
            const response = await api.get('/auth/check-auth/')
            setUser(response.data.user)
        }catch(error){
            setUser(null)
        }finally{
            setLoading(false)
        }
    }

    const login = async (username, password) => {
        try{
            const response = await api.post('/auth/login/', {username, password})
            setUser(response.data.user)
            return { success:true }
        }catch(error){
            return{success:false, error: error.response?.data?.non_field_errors?.[0] || 'Login failed'}
        }
    }
    
    const register = async (userData) => {
        console.log("DEBUG - Sending registration data:", userData);

        try {
            // Use a CLEAN axios instance without interceptors
            const cleanAxios = axios.create({
                baseURL: 'http://localhost:8000/api',
                withCredentials: true,
            });
            
            // No Authorization header, no interceptors
            const response = await cleanAxios.post('/auth/register/', userData);
            
            console.log("DEBUG - Registration response:", response.data);

            setUser(response.data.user);
            return { success: true };
            
        } catch (error) {
            console.log("DEBUG - Registration error details:", {
                status: error.response?.status,
                data: error.response?.data,
                fullError: error,
            });

            let errorMessage = 'Registration failed';
            if (error.response?.data) {
                if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (typeof error.response.data === 'object') {
                    // Handle serializer validation errors
                    errorMessage = Object.values(error.response.data)
                        .flat()
                        .join(' ');
                } else {
                    errorMessage = error.response.data;
                }
            }

            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try{
            await api.post('/auth/logout/')
            setUser(null)
        }catch(error){
            console.error('Logout error', error)
        }
    }
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            register, 
            logout, 
            checkAuth 
        }}>
          {children}
        </AuthContext.Provider>
    )
}