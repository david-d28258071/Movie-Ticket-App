import { useUser, useAuth } from "@clerk/clerk-react";
import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { data, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();           
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${await getToken()}` 
        }

        
      });

      setIsAdmin(data.isAdmin);

      

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized");
      }
    } catch (error) {
      console.error("Admin check failed:", error);
    }
  };

  

  const fetchShows = async () => {

    console.log("🔥 fetchShows CALLED");

    try {

      const { data } = await axios.get("/api/show/all");

          console.log("📦 API RESPONSE:", data);
      
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message, "ooooooooo");
      }
    } catch (error) {
      console.log("Backend response:", error.data)

      console.error("Fetch shows failed:", error);
    }
  };

  

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${await getToken()}` // ✅ FIX
        }
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Favorites fetch failed:", error);
    }
  };
 
  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies(); // ✅ FIX
    }
  }, [user]);

  const value = {
    axios,
    user,
    getToken,
    isAdmin,
    shows,
    favoriteMovies,
    fetchIsAdmin,
    fetchFavoriteMovies,
    image_base_url,
    navigate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
