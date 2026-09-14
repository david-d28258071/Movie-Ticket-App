import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "./Title";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [dashBoardData, setDashBoardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    activeUser: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ================= DASHBOARD CARDS ================= */
  const dashBoardCards = [
    {
      title: "Total Bookings",
      value: dashBoardData.totalBookings,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency}${dashBoardData.totalRevenue}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashBoardData.activeShows.length,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashBoardData.activeUser,
      icon: UserIcon,
    },
  ];

  /* ================= FETCH DASHBOARD DATA ================= */
  const fetchDashBoardData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashBoardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= USE EFFECT ================= */
  useEffect(() => {
    if (user) {
      fetchDashBoardData();
    }
  }, [user]);

  /* ================= LOADING ================= */
  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* DASHBOARD CARDS */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0px" />

        <div className="flex gap-4 w-full">
          {dashBoardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md w-full"
              >
                <div>
                  <p className="text-sm">{card.title}</p>
                  <p className="text-xl font-medium mt-1">{card.value}</p>
                </div>
                <Icon className="w-6 h-6" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SHOWS */}
      <p className="mt-10 text-lg font-medium">Active Shows</p>

      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />

        {dashBoardData.activeShows.map((show) => {
          if (!show.movie) return null;

          return (
            <div
              key={show._id}
              className="w-55 rounded-lg overflow-hidden bg-primary/10 border border-primary/20 hover:-translate-y-1 transition"
            >
              <img
                src={image_base_url + show.movie.poster_path}
                alt={show.movie.title}
                className="h-60 w-full object-cover"
              />

              <p className="font-medium p-2 truncate">
                {show.movie.title}
              </p>

              <div className="flex items-center justify-between px-2">
                <p className="text-lg font-medium">
                  {currency}
                  {show.showPrice}
                </p>

                <p className="flex items-center gap-1 text-sm text-gray-400">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.movie.vote_average?.toFixed(1)}
                </p>
              </div>

              <p className="px-2 text-sm text-gray-500">
                {dateFormat(show.showDateTime)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
