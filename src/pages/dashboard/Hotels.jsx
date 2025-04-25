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
import './hotel.css'


export function Hotels() {
    const {hotelloading, setloading, hotels, cities, fetchHotels, url, language, setLanguage, EditCity, SetEditHotel, tostMsg, SetTostMsg, HotelDataAllLang } = useContext(StoreContext);
    const navigate = useNavigate();
    const [Cities, setCities] = useState([]); // State for cities data
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
    const [isUpdateCityModalOpen, setIsUpdateCityModalOpen] = useState(false);
    const [isDltHotelModalOpen, setIsDltHotelModalOpen] = useState(false);
    const [Hotelid, SetHotelId] = useState('')


    const rowsPerPage = 10; // Number of rows per page
    const agentid = "673ef93329933f9da9d46d2a"; // Replace with dynamic agentid if needed





    // Pagination logic
    const totalPages = Math.ceil(hotels.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = hotels.slice(startIndex, startIndex + rowsPerPage);



    useEffect(() => {
        fetchHotels()
        console.log(hotels)

        // console.log(hotels)
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

    const handleAddCity = () => {

        navigate("/dashboard/add-hotel");
    };
    const handleUpdateHoel = (hotel) => {
        const findhotel = HotelDataAllLang.filter((item) => item._id === hotel._id)
        SetEditHotel(findhotel)
        setloading(false)
        navigate("/dashboard/update-hotel")
    }

    const DltHotel = (hotel) => {
        //fetch all rooms filter with hotelid if length > 0 then show modal
        SetHotelId(hotel._id)
        console.log(hotel)
        setIsDltHotelModalOpen(true)
    }
    const handleDelete = async (city) => {
        try {

            const response = await axios.delete(`${url}/api/admin/deletehotel/${Hotelid}`)
            if (response.data.success) {
                toast.success(response.data.message)
                setIsDltHotelModalOpen(false)
                fetchHotels();

            }
        } catch (error) {
            toast.error(error)
            console.log(error)
        }
    }

    const facilitypage = () => {
        navigate('/dashboard/facilities')
    }

    const policypage = () => {
        navigate('/dashboard/policies')
    }
    if (hotelloading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        );
        
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
                        Hotels Table
                    </Typography>

                    <div className="flex items-center gap-4">
                        {/* Trigger Button */}
                        <Button
                            variant="text"
                            color="light-gray"
                            onClick={handleAddCity}
                            className="bg-gray-500 hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                        >
                            ADD HOTEL
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
                     {currentData.length === 0 ? (
                                    <Typography
                                        className="text-center text-gray-500 font-medium py-8"
                                        variant="h6"
                                    >
                                        No Hotels available.
                                    </Typography>
                                ) : (
                                    <>
                                     <table className="w-full min-h-[0px] table-auto">
                        <thead>
                            <tr>
                                {["Image", "Name", "City", "Brand", "Description",  "Action"].map((header) => (
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
                            {currentData.map((hotel, index) => {
                                const city = cities.find((c) => c._id === hotel.city); // Match city by ID 
                                return (

                                    <tr key={index}>
                                        {/* Image */}
                                        <td className="px-5 p-2 border-b border-blue-gray-50">
                                            <Avatar
                                                src={hotel.gallery ? `${url}/Images/${hotel.gallery[0].galleryimage}` : "/path/to/placeholder.jpg"}
                                                alt={hotel.gallery[0].galleryimage}
                                                size="lg"
                                                variant="rounded"
                                                className="w-20 "
                                            />
                                        </td>

                                        {/* City Name */}
                                        <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                {hotel.name}
                                            </Typography>
                                        </td>

                                        {/* Brand Name */}
                                        <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                {hotel ? hotel.city : "City not found"}
                                            </Typography>
                                        </td>

                                        {/* Brand name */}
                                        <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                Al Mukhtara
                                            </Typography>
                                        </td>

                                        {/* description */}
                                        {/* description */}
                                        <td className="px-5 w-60 border-b border-blue-gray-50 min-h-[100px]">
                                            <div className="overflow-y-auto  max-h-[50px]">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="cursor-pointer text-xs font-normal text-blue-gray-500">
                                                    {hotel.description}
                                                </Typography>
                                            </div>
                                        </td>

                                       

                                        {/* Action Icons */}
                                        <td className="px-5 border-b border-blue-gray-50">
                                            <div className="flex  gap-2">
                                                <AiFillEdit
                                                    className="hover:text-blue-gray-500"
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => handleUpdateHoel(hotel)}
                                                />
                                                <MdDelete
                                                    className="hover:text-blue-gray-500"
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => DltHotel(hotel)}
                                                />
                                                <AlertHotelMsg
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
                                    </>
                                )}
                   
                </CardBody>
            </Card>
        </div>
    );
}

export default Hotels;
