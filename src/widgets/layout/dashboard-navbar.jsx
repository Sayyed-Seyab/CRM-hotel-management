import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@/context/context";
export function DashboardNavbar() {
  const navigate = useNavigate();
  const {
    url,
    language,
    setLanguage,
    cities,
    setCities,
    fetchCities,
    hotels,
    setHotels,
    fetchHotels,
    Rooms,
    setRooms,
    fetchRooms,
    Restaurants,
    setRestaurants,
    fetchrestaurants,
    loyalty,
    setLoyalty,
    fetchloyalty,
    admin,
    setadmin,
  } = useContext(StoreContext);
  
  const [controller] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  
  const Dashboardcities = pathname.startsWith("/dashboard/cities");
  const dashbaordhotels = pathname.startsWith("/dashboard/hotels");
  const dashboardrooms = pathname.startsWith("/dashboard/rooms");
  const dashboardrestaurants = pathname.startsWith("/dashboard/restaurants");
  const dashbaordloyalty = pathname.startsWith("/dashboard/loyalty");
  
  const filterdata = (e) => {
    const value = e.target.value.toLowerCase();
  
    if (Dashboardcities) {
      if (value) {
        const search = cities.filter((item) =>
          item.name.toLowerCase().includes(value)
        );
        setCities(search);
      } else {
        fetchCities();
      }
    } else if (dashbaordhotels ) {
      if (value) {
        const search = hotels.filter((item) =>
          item.name.toLowerCase().includes(value)
        );
        if(search){
            setHotels(search)
        }
        
        const searchByCity = cities.filter((item)=> item.name.toLowerCase().includes(value))
        if(searchByCity){
          const CityHotels = hotels.filter((hotel)=> hotel.city === searchByCity[0]._id) 
         
             setHotels(CityHotels)
          }
        // setHotels(search);
        // if (search) {
        //   const room = Rooms.filter((room) => room.hotelid === search._id);
        //   setRooms(room);
        // } else {
        //   setRooms([]);
        // }
       
      } else {
        fetchHotels();
      }
    } else if (dashboardrooms) {
      if (value) {
        const hotelMatch = hotels.find((hotel) =>
          hotel.name.toLowerCase().includes(value)
        );
        if (hotelMatch) {
          const search = Rooms.filter((room) => room.hotel === hotelMatch._id);
          setRooms(search);
        } else {
          setRooms([]);
        }
      } else {
        fetchRooms();
      }
    } else if (dashboardrestaurants) {
      if (value) {
        const hotelMatch = hotels.find((hotel) =>
          hotel.name.toLowerCase().includes(value)
        );
        if (hotelMatch) {
          const search = Restaurants.filter(
            (restaurant) => restaurant.hotel === hotelMatch._id
          );
          setRestaurants(search);
        } else {
          setRestaurants([]);
        }
      } else {
        fetchrestaurants();
      }
    } else if (dashbaordloyalty) {
      if (value) {
        const search = loyalty.filter((item) =>
          item.name.toLowerCase().includes(value)
        );
        setLoyalty(search);
      } else {
        fetchloyalty();
      }
    }
  };

  const logout = ()=>{
    // Clear localStorage
  localStorage.removeItem('adminData');

  // Optionally reset state (if using React state for admin data)
  setadmin(null); // Ensure setadmin is accessible in your component

  // Redirect to login page
  navigate('/'); // Ensure navigate is initialized using useNavigate()
  }
  
  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center gap-5">
        <div className="">
            <Select
              value={language}
              onChange={(value) => setLanguage(value)} // Directly use the value
              className=""
              
            >
              <Option value="english">English</Option>
              <Option value="arabic">Arabic</Option>
            </Select>
            </div>
          <div className="mr-auto md:mr-4 md:w-56">
            <Input 
             label="Search"
             
             onChange={filterdata} />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>


          <div>
           {admin ?  <Button onClick={logout}>LOGOUT</Button> : null}
          </div>

          {/* <Link to="/auth/sign-in">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              Sign In
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link> */}
          {/* <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu> */}
          {/* <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton> */}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
