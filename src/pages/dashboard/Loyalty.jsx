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


export function Loyalty() {
    const {fetchloyalty,loyalty, ErrortMsg, SetErrortMsg,LoyaltyAllLang, setCities, url, language, setLanguage, EditCity, Editloyalty, setEditLoyalty, tostMsg, SetTostMsg } = useContext(StoreContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
    const [isUpdateCityModalOpen, setIsUpdateCityModalOpen] = useState(false);
    const [isDltCityModalOpen, setIsDltCityModalOpen] = useState(false);
    const [LoyaltyId, SetLoyaltyId] = useState('')


    const rowsPerPage = 5; // Number of rows per page
   

    useEffect(() => {
        fetchloyalty();
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


       
    }, [ language,]);


    // Pagination logic
    const totalPages = Math.ceil(loyalty.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = loyalty.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddCity = () => {

        navigate("/dashboard/add-loyalty");
    };
    const handleUpdateLoyalty = (loyalty) => {
        const findloyalty = LoyaltyAllLang.filter((item) => item._id === loyalty._id)
         setEditLoyalty(findloyalty)
        navigate("/dashboard/update-loyalty")
    }

    const Dltloyalty = (loyalty) => {
        //fetch all hotels filter with cityid if length > 0 then show modal
        SetLoyaltyId(loyalty._id)
        // setIsDltCityModalOpen(true)
    }
    const handleDelete = async (loyalty) => {
        try {

            const response = await axios.delete(`${url}/api/admin/loyaltyplan/${loyalty._id}`)
            if (response.data.success) {
                toast.success(response.data.message)
                // setIsDltCityModalOpen(false)
                fetchloyalty();

            }
        } catch (error) {
            toast.error(error)
        }
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
                       Loyalty Table
                    </Typography>

                    <div className="flex items-center gap-4">
                        {/* Trigger Button */}
                        <Button
                            variant="text"
                            color="light-gray"
                            onClick={handleAddCity}
                            className="bg-gray-500  hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                        >
                            ADD LOYALTY
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
                    <table className="w-full min-h-[0px] table-auto">
                        <thead>
                            <tr>
                                {["Image", "Name", "Points-Per-SAR","Min-Points-Redeem", "Action"].map((header) => (
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
                            {currentData.map((loyalty, index) => (
                                <tr key={index}>
                                    {/* Image */}
                                    <td className="px-5 py-2 border-b border-blue-gray-50">
                                        <Avatar
                                            src={loyalty.loyaltyplanimage ? `${url}/Images/${loyalty.loyaltyplanimage}` : "/path/to/placeholder.jpg"}
                                            alt={loyalty.alt}
                                            size="lg"
                                            variant="rounded"
                                            className="w-15"
                                        />
                                    </td>

                                    {/* loyalty Name */}
                                    <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                            {loyalty.plantype}
                                        </Typography>
                                    </td>

                                    {/* Ern point per sar */}
                                    <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                            {loyalty.valueearned}
                                        </Typography>
                                    </td>

                                     {/* Min points to redeem */}
                                     <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                            {loyalty.minimumpointstoredeem}
                                        </Typography>
                                    </td>

                                    {/* Action Icons */}
                                    <td className="px-5 border-b border-blue-gray-50">
                                        <div className="flex justify-center items-center gap-2">
                                            <AiFillEdit
                                                className="hover:text-blue-gray-500"
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => handleUpdateLoyalty(loyalty)}
                                            />
                                            <MdDelete
                                                className="hover:text-blue-gray-500"
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => handleDelete(loyalty)}
                                            />
                                            <Alertmsg
                                                isOpen={isDltCityModalOpen}
                                                onClose={() => setIsDltCityModalOpen(false)}
                                                onAgree={handleDelete}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

export default Loyalty;
