import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import AddCityForm from "./widgets/cityform/Addcity";
import { Cities } from "./pages/dashboard/Cities";
import Hotels from "./pages/dashboard/Hotels";
import Rooms from "./pages/dashboard/Rooms";
import Resturants from "./pages/dashboard/Resturants";
import { GiModernCity } from "react-icons/gi";
import { LiaHotelSolid } from "react-icons/lia";
import { MdMeetingRoom } from "react-icons/md";
import { MdRestaurant } from "react-icons/md";
import { LuPackagePlus } from "react-icons/lu";
import Loyalty from "./pages/dashboard/Loyalty";
import Brands from "./pages/dashboard/Brands";
import { TbBrandDatabricks } from "react-icons/tb";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
  
    layout: "dashboard",
    pages: [
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "dashboard",
      //   path: "/home",
      //   element: <Home />,
      // },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TbBrandDatabricks {...icon} />,
        name: "Brands",
        path: "/brands",
        element: <Brands/>,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // },
     
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },
  {
    title: "Manage hotel",
    layout: "dashboard",
    pages: [
      {
        icon:<GiModernCity style={{fontSize:'20px'}} />,
        name: "manage cities",
        path: "/cities",
        element: <Cities />,
      },

      
      {
        icon: <LiaHotelSolid style={{fontSize:'20px'}} />,
        name: "manage hotels",
        path: "/hotels",
        element: <Hotels/>,
      },
      {
        icon: <MdMeetingRoom style={{fontSize:'20px'}} />,
        name: "manage rooms",
        path: "/rooms",
        element: <Rooms />,
      },
      {
        icon: <MdRestaurant style={{fontSize:'20px'}} />,
        name: "manage resturants",
        path: "/restaurants",
        element: <Resturants />,
      },
      
    ],
  },

  {
    title: "Manage Discount",
    layout:'dashboard',
    pages:[
      {
        icon: <LuPackagePlus {...icon} />,
        name: "Manage Loyalty",
        path: "/loyalty",
        element: <Loyalty/>,
      },

    ]
  },


  // {
  //   title: "Auth",
  //   layout: "auth",
  //   pages: [
     
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
      
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
