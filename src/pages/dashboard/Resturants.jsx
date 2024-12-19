import React, { useState, useEffect, useContext } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
    Select,
    Option,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/context";
import AddCityModal from "@/widgets/cityform/Addcity";
import UpdateCityModal from "@/widgets/cityform/Updatecity";
import Alertmsg from "@/widgets/cityform/Alertmsg";
import { toast } from "react-toastify";
import AlertHotelMsg from "@/widgets/Hotelforms/AlrtHotelMsg";
import AlertMsgRes from "@/widgets/ResturentFroms/AlerMsgRes";


export function Resturants() {
    const { Restaurants, cities, cuisineId, setCuisisneID, diningId, setDiningId, hotels, fetchHotels, url, fetchrestaurants, language, setLanguage, EditCity, SetEditrestaurant, tostMsg, SetTostMsg, RestaurantAllLang } = useContext(StoreContext);
    const navigate = useNavigate();
    const [Cities, setCities] = useState([]); // State for cities data
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
    const [isUpdateCityModalOpen, setIsUpdateCityModalOpen] = useState(false);
    const [isDltHotelModalOpen, setIsDltHotelModalOpen] = useState(false);
    const [RestaurantId, SetRestaurantid] = useState('')


    const rowsPerPage = 5; // Number of rows per page
    const agentid = "673ef93329933f9da9d46d2a"; // Replace with dynamic agentid if needed





    // Pagination logic
    const totalPages = Math.ceil(Restaurants.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = Restaurants.slice(startIndex, startIndex + rowsPerPage);



    useEffect(() => {
        fetchrestaurants()
        console.log(Restaurants)

        // console.log(Restaurants)
        if (tostMsg !== null) {
            // Show toast and reset state after a delay
            const toastTimeout = setTimeout(() => {
                toast.success(tostMsg);
            }, 1000);

            const resetTimeout = setTimeout(() => {
                SetTostMsg(null); // Reset state after 5 seconds
            }, 5000);

            // Cleanup timeouts on component unmount
            return () => {
                clearTimeout(toastTimeout);
                clearTimeout(resetTimeout);
            };
        }


    }, [url, language,]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddResturant = () => {

        navigate("/dashboard/add-resturant");
    };
    const handleUpdateRestaurant = (restaurant) => {
        console.log(RestaurantAllLang)
        const findrestaurant = RestaurantAllLang.filter((item) => item._id === restaurant._id)
        SetEditrestaurant(findrestaurant)
        navigate("/dashboard/update-restaurant")
    }

    const DltRestaurant = (hotel) => {
        //fetch all rooms filter with RestaurantId if length > 0 then show modal
        SetRestaurantid(hotel._id)
        console.log(hotel)
        setIsDltHotelModalOpen(true)
    }
    const handleDelete = async (city) => {
        try {

            const response = await axios.delete(`${url}/api/admin/deleteresturant/${RestaurantId}`)
            if (response.data.success) {
                toast.success(response.data.message)
                setIsDltHotelModalOpen(false)
                fetchrestaurants();

            }
        } catch (error) {
            toast.error(error)
            console.log(error)
        }
    }

    const diningpage = (dining) => {

        setDiningId(dining._id)
        navigate('/dashboard/dining')
    }

    const cuisinepage = (cuisine) => {
        setCuisisneID(cuisine._id)

        navigate('/dashboard/cuisines')
    }


    return (


        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-8 p-6 flex justify-between"
                >
                    <Typography variant="h6" color="white">
                        Restaurants Table
                    </Typography>

                    <div className="flex items-center gap-4">
                        {/* Trigger Button */}
                        <Button
                            variant="text"
                            color="light-gray"
                            onClick={handleAddResturant}
                            className="bg-gray-500 hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                        >
                            ADD RESTAURANT
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
                    <table className="w-full min-h-[0px] table-auto">
                        <thead>
                            <tr>
                                {["Image", "Name", "Hotel", "Description", "Action"].map((header) => (
                                    <th
                                        key={header}
                                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((restaurant, index) => {
                                const city = cities.find((c) => c._id === restaurant.cityid); // Match city by ID 
                                const hotel = hotels.find((c) => c._id === restaurant.hotelid); // Match city by ID 
                                return (

                                    <tr key={index}>
                                        {/* Image */}
                                        <td className="px-5 p-2 border-b border-blue-gray-50">
                                            <Avatar
                                                src={
                                                    restaurant.gallery?.[0]?.url
                                                        ? `${url}/Images/${restaurant.gallery[0].url}`
                                                        : "/path/to/placeholder.jpg"
                                                }
                                                alt={restaurant.gallery?.[0]?.url || "placeholder image"}
                                                size="lg"
                                                variant="rounded"
                                                className="w-20"
                                            />
                                        </td>

                                        {/* resturant Name */}
                                        <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                {restaurant.name}
                                            </Typography>
                                        </td>

                                        {/* Brand Name */}
                                        {/* <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {city ? city.name : "No City"}
                                        </Typography>
                                    </td> */}

                                        {/* hotel name */}
                                        <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                {hotel ? hotel.name : "No Hotle"}
                                            </Typography>
                                        </td>

                                        <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                            <Typography variant="small" color="blue-gray" className="cursor-pointer text-xs font-normal text-blue-gray-500">
                                                {restaurant.description}
                                            </Typography>
                                        </td>

                                        {/* facilities */}
                                        {/* //  <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                    //     <Typography onClick={()=>diningpage(restaurant)} variant="small" color="blue-gray" className="cursor-pointer text-xs font-normal text-blue-gray-500">
                                    //      VIEW
                                    //     </Typography>
                                    // </td> */}

                                        {/* Policies */}
                                        {/* <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography onClick={()=>cuisinepage(restaurant)}  color="blue-gray" className="cursor-pointer text-xs font-normal text-blue-gray-500">
                                            VIEW
                                        </Typography>
                                    </td> */}

                                        {/* Action Icons */}
                                        <td className="px-5 border-b border-blue-gray-50">
                                            <div className="flex  gap-2">
                                                <AiFillEdit
                                                    className="hover:text-blue-gray-500"
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => handleUpdateRestaurant(restaurant)}
                                                />
                                                <MdDelete
                                                    className="hover:text-blue-gray-500"
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => DltRestaurant(restaurant)}
                                                />
                                                <AlertMsgRes
                                                    isOpen={isDltHotelModalOpen}
                                                    onClose={() => setIsDltHotelModalOpen(false)}
                                                    onAgree={handleDelete}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <Typography
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="text-sm hover:text-blue-gray-500 font-bold rounded-lg p-1 cursor-pointer  ml-4"
                            size="sm"
                        >
                            Previous
                        </Typography>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    variant={currentPage === index + 1 ? "gradient" : "text"}
                                    color={currentPage === index + 1 ? "blue" : "gray"}
                                    className="text-sm "
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </div>
                        <Typography
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="text-sm hover:text-blue-gray-500 font-bold rounded-lg p-1 cursor-pointer  mr-5"
                            size="sm"
                        >
                            Next
                        </Typography>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default Resturants;
