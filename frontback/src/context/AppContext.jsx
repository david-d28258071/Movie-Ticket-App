import { useUser , useAuth } from "@clerk/clerk-react";
import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


export const AppContext = createContext();

export const AppProvider = ({children})=>{

    const [isAdmin , setIsAdmin] = useState(false)
    const [shows , setShows] = useState([])
    const [favoriteMovies , setFavoriteMovies] = useState([])

     const {user} = useUser
     const {getToken} = useAuth()
     const location = useLocation()
     const navigate = useNavigate()


    const fetchIsAdmin = async ()=>{
        try {
            const {data} = await axios.get('/api/admin/is-admin' , {headers: {Autherization: `Bearer ${await getToken()}`}})

            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('you are not autherized to access to admin dashboard')
            }
        } catch (error) {
            console.error(error)        }
    }

     const fetchShows = async ()=>{
        try {
            const {data} = await axios.get('/api/show/all' )
            if(data.success){
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.error(error)
            
        }
     } 

         const fetchFavoriteMovies = async ()=>{
            try {
                const  {data} = await axios.get('/api/user/favorites' , {headers: {Autherization: `Bearer ${await getToken()}`}})

                if(data.success){
                    setFavoriteMovies(data.movies)
                } else{
                    toast.error(data.message)
                }
                
            } catch (error) {
                 console.error(error)
                
            }
         } 

     useEffect(()=>{

        fetchShows()
     },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies
        }
    } , [user])

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows,
        favoriteMovies, fetchFavoriteMovies

    }
    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>

    )
}

export const useAppContext = ()=> useContext(AppContext);

