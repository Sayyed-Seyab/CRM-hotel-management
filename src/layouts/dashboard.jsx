import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import AddCityForm from "@/widgets/cityform/Addcity";
import Updatecity from "@/widgets/cityform/Updatecity";
import Addhotel from "@/widgets/Hotelforms/Addhotel";
import FacilityTab from "@/widgets/HotelTables/FacilityTab";
import PolicyTab from "@/widgets/HotelTables/PolicyTab";
import UpdateHotel from "@/widgets/Hotelforms/UpdateHotel";
import AddRoom from "@/widgets/Roomfoms/AddRoom";
import UpdateRoom from "@/widgets/Roomfoms/UpdateRoom";
import AddRestaurant from "@/widgets/ResturentFroms/AddResturant";
import DiningTab from "@/widgets/ResturanTabs/DiningTab";
import CusisineTab from "@/widgets/ResturanTabs/CuisineTab";
import UpdateRestaurant from "@/widgets/ResturentFroms/UpdateRestaurant";
import AddLoyalty from "@/widgets/Loyaltyform/AddLoyalty";
import UpdateLoyalty from "@/widgets/Loyaltyform/UpdateLoyalty";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  console.log(routes)

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
        <Route path="/add-city"  element={<AddCityForm/>}  />
        <Route path="/update-city"  element={<Updatecity/>}  />
        <Route path="/add-hotel"  element={<Addhotel/>}  />
        <Route path="/facilities"  element={<FacilityTab/>}  />
        <Route path="/policies"  element={<PolicyTab/>}  />
        <Route path="/update-hotel"  element={<UpdateHotel/>}  />
        <Route path="/add-room"  element={<AddRoom/>}  />
        <Route path="/update-room"  element={<UpdateRoom/>}  />
        <Route path="/add-resturant"  element={<AddRestaurant/>}  />
        <Route path="/dining"  element={<DiningTab/>}  />
        <Route path="/cuisines"  element={<CusisineTab/>}  />
        <Route path="/update-restaurant"  element={<UpdateRestaurant/>}  />
        <Route path="/add-loyalty"  element={<AddLoyalty/>}  />
        <Route path="/update-loyalty"  element={<UpdateLoyalty/>}  />

          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard"  &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}

            
         
        
        </Routes>
        <div className="text-blue-gray-600">
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
