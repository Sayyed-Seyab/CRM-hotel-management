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
import AlertRoomMsg from "@/widgets/Roomfoms/AlertRoomMsg";


export function Rooms() {
    const {roomloading, setloading, fetchRooms, cities, Rooms, RoomAllLang, hotels,  SetEditroom, setRoomDataAllLang,  url, language, setLanguage,  tostMsg, SetTostMsg } = useContext(StoreContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
    const [isDltRoomModalOpen, setDltRoomModalOpen,] = useState(false);
    const [isDltCityModalOpen, setIsDltCityModalOpen] = useState(false);
    const [RoomId, SetRoomId] = useState('')


    const rowsPerPage = 10; // Number of rows per page
   

    useEffect(() => {
        fetchRooms()
       
     
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
        console.log(hotels)
    }, [ language, hotels]);


    // Pagination logic
    const totalPages = Math.ceil(Rooms.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = Rooms.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddRoom = () => {

        navigate("/dashboard/add-room");
    };
    const handleUpdateRoom = (room) => {
        console.log(room)
        setloading(false)
        // setIsUpdateRoomModalOpen(true)
        const findroom = RoomAllLang.filter((item) => item._id === room._id)
        SetEditroom(findroom)
        navigate("/dashboard/update-room")
    }

    const Dltroom = (city) => {
        //fetch all hotels filter with cityid if length > 0 then show modal
        SetRoomId(city._id)
        setDltRoomModalOpen(true)
    }
    const handleDelete = async (city) => {
        try {
            
            const response = await axios.delete(`${url}/api/admin/deleteroom/${RoomId}`)
            if (response.data.success) {
                toast.success(response.data.message)
                fetchRooms();
                setDltRoomModalOpen(false)
               

            }
        } catch (error) {
            toast.error(response.data.message)
        }
    }
    if (roomloading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        );
        
      }
    console.log(Rooms)
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-8 p-6 flex justify-between"
                >
                    <Typography variant="h6" color="white">
                       Rooms Table
                    </Typography>

                    <div className="flex items-center gap-4">
                        {/* Trigger Button */}
                        <Button
                            variant="text"
                            color="light-gray"
                            onClick={handleAddRoom}
                            className="bg-gray-500  hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                        >
                            ADD ROOM
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
                     {currentData.length === 0 ? (
                                    <Typography
                                        className="text-center text-gray-500 font-medium py-8"
                                        variant="h6"
                                    >
                                        No Rooms available.
                                    </Typography>
                                ) : (
                                    <>
                                        <table className="w-full min-h-[0px] table-auto">
                        <thead>
                            <tr>
                                {["Image", "Name", "Price-Per-Night", "Max-Occupancy", "Hotel", "Action"].map((header) => (
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
                            {currentData.map((room, index) => {
                                 const hotel = hotels.find((c) => c._id === room.hotelid);
                            return(
                                
                                <tr key={index}>
                                    {/* Image */}
                                    <td className="px-5 py-2 border-b border-blue-gray-50">
                                        <Avatar
                                        className="w-20"
                                        size="lg"
                                            variant="rounded"
                                           src={
                                            room.gallery && room.gallery[0] && room.gallery[0].galleryimage
                                                ? `${url}/Images/${room.gallery[0].galleryimage}`
                                                : "/path/to/placeholder.jpg"
                                        }
                                        
                                            // alt={room.gallery[0].galleryimage}
                                            // size="lg"
                                            // variant="rounded"
                                            // className="w-80"
                                        />
                                    </td>

                                    {/* Room Name */}
                                    <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                            {room.name}
                                        </Typography>
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                            {room.ratepernight}
                                        </Typography>
                                    </td>

                                     {/* max bookable */}
                                     <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                            {room.maxoccupancy}
                                        </Typography>
                                    </td>
                                    {/* max bookable for agent */}
                                    <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                            {hotel ? hotel.name : 'No assign hotel'}
                                        </Typography>
                                    </td>

                                    {/* Action Icons */}
                                    <td className="px-5 border-b border-blue-gray-50">
                                        <div className="flex  gap-2">
                                            <AiFillEdit
                                                className="hover:text-blue-gray-500"
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => handleUpdateRoom(room)}
                                            />
                                            <MdDelete
                                                className="hover:text-blue-gray-500"
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => Dltroom(room)}
                                            />
                                            <AlertRoomMsg
                                                isOpen={isDltRoomModalOpen}
                                                onClose={() => setDltRoomModalOpen(false)}
                                                onAgree={handleDelete}
                                            />
                                        </div>
                                    </td>
                                </tr>
)
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

export default Rooms;
