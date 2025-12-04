import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const AdminSideBar = () => {
  const user = {
    firstname: "Admin",
    lastname: "User",
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    { name: "List Booking", path: "/admin/list-bookings", icon: ListCollapseIcon },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      
      {/* Sidebar */}
      <div className="flex flex-col items-center pt-8 w-[240px] border-r border-gray-300/20 text-sm bg-gray">
        <img
          src={user.imageUrl}
          alt="sidebar"
          className="h-14 w-14 rounded-full mx-auto"
        />

        <p className="mt-2 text-base max-md:hidden font-medium">
          {user.firstname} {user.lastname}
        </p>

        <div className="w-full mt-6">
          {adminNavlinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end
              className={({ isActive }) =>
                `relative flex items-center gap-3 w-full py-3 px-6 transition-colors
                 text-gray-500 hover:bg-gray
                 ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`}
                  />
                  <p className="max-md:hidden">{link.name}</p>
                  <span
                    className={`absolute right-0 top-1/2 -translate-y-1/2 
                                w-1.5 h-8 rounded-l-md transition-all
                                ${isActive ? "bg-primary" : "bg-transparent"}`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet /> {/* ✅ Render child routes like Dashboard, AddShows, etc. */}
      </div>
    </div>
  );
};

export default AdminSideBar;
