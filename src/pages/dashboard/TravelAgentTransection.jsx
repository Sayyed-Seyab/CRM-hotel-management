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
import moment from "moment";


export function TravelAgentTransection() {
    const {admin, transcloading, setloading, FilteredTravelAgents,fetchTravelAgent, fetchTravelAgentTransection,TravelAgentTransection,SetTravelAgentTransection, setcityDataAllLang, setCities, url, language, setLanguage, EditCity, SetEditCity, tostMsg, SetTostMsg } = useContext(StoreContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
    const [isUpdateCityModalOpen, setIsUpdateCityModalOpen] = useState(false);
    const [isDltCityModalOpen, setIsDltCityModalOpen] = useState(false);
    const [CityId, SetCityId] = useState('')


    const rowsPerPage = 20; // Number of rows per page
   

    useEffect(() => {
        fetchTravelAgentTransection()
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
    const totalPages = Math.ceil(TravelAgentTransection.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = TravelAgentTransection.slice(startIndex, startIndex + rowsPerPage);
console.log(currentData)
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddTransection = () => {

        navigate("/dashboard/add-transection");
    };
    // const handleUpdateCity = (city) => {
    //     setIsUpdateCityModalOpen(true)
    //     const findcity = cityDataAllLang.filter((item) => item._id === city._id)
    //     SetEditCity(findcity)
    //     setloading(false)
    //     navigate("/dashboard/update-city")
    // }

    // const Dlttcity = (city) => {
    //     //fetch all hotels filter with cityid if length > 0 then show modal
    //     SetCityId(city._id)
    //     setIsDltCityModalOpen(true)
    // }
    // const handleDelete = async (city) => {
    //     try {

    //         const response = await axios.delete(`${url}/api/admin/deletecity/${CityId}`)
    //         if (response.data.success) {
    //             toast.success(response.data.message)
    //             setIsDltCityModalOpen(false)
    //             fetchCities();

    //         }
    //     } catch (error) {
    //         toast.error(response.data.message)
    //     }
    // }

    
  const SecretKey = 'mySecretKey123'; // Replace with your actual secret key
  //password Admin123,
   // Encrypt data using CryptoJS AES
  function encrypt(data, Key) {
      try {
          // Convert the data to a string if it's not already
          const stringData = typeof data === 'string' ? data : JSON.stringify(data);
          const cipherText = CryptoJS.AES.encrypt(stringData, Key).toString();
          console.log(cipherText)
          return cipherText;
      } catch (error) {
          console.log("Encryption error:", error);
          return null; // Handle encryption error
      }
    } 

   
    if (transcloading) {
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
                       Transections Table
                    </Typography>

                    <div className="flex items-center gap-4">
                        {/* Trigger Button */}
                        <Button
                            variant="text"
                            color="light-gray"
                            onClick={handleAddTransection}
                            className="bg-gray-500  hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                        >
                            ADD TRANSECTION
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
                     {currentData.length === 0 ? (
                                    <Typography
                                        className="text-center text-gray-500 font-medium py-8"
                                        variant="h6"
                                    >
                                        No Cities available.
                                    </Typography>
                                ) : (
                                    <>
                                    <table className="w-full min-h-[0px] table-auto">
                        <thead>
                            <tr>
                                {["Name","Email", "Amount",  "Ref-ID","type", "Date", "Added-by"].map((header) => (
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
                            {currentData.map((transc, index) => {
                                //  const addedby = TravelAgentTransection.find((t) => t.addedby === admin.value.id); 
                               return (
                                <tr key={index}>
                                {/* Image */}
                                <td className="px-5 py-2 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {transc.user.name}
                                    </Typography>
                                </td>

                                {/* transc Name */}
                                <td className="px-5 border-b border-blue-gray-50 min-h-[100px]">
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {transc.user.email}
                                    </Typography>
                                </td>

                                {/* Description */}
                                <td className=" px-5 border-b border-blue-gray-50  min-h-[100px]">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {transc.amount}
                                    </Typography>
                                </td>

                                <td className=" px-5 border-b border-blue-gray-50  min-h-[100px]">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {transc.refid}
                                    </Typography>
                                </td>

                                <td className=" px-5 border-b border-blue-gray-50  min-h-[100px]">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {transc.type}
                                    </Typography>
                                </td>
                                <td className=" px-5 border-b border-blue-gray-50  min-h-[100px]">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                {moment(transc.createdat).format("MMMM Do YYYY, h:mm:ss a")}
                                    </Typography>
                                </td>
                                <td className=" px-5 border-b border-blue-gray-50  min-h-[100px]">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {transc.transcaddedby?.name}
                                    </Typography>
                                </td>

                                {/* Action Icons */}
                                {/* <td className="px-5 border-b border-blue-gray-50">
                                    <div className="flex justify-center items-center gap-2">
                                        <AiFillEdit
                                            className="hover:text-blue-gray-500"
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                            onClick={() => handleUpdateCity(city)}
                                        />
                                        <MdDelete
                                            className="hover:text-blue-gray-500"
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                            onClick={() => Dlttcity(city)}
                                        />
                                        <Alertmsg
                                            isOpen={isDltCityModalOpen}
                                            onClose={() => setIsDltCityModalOpen(false)}
                                            onAgree={handleDelete}
                                        />
                                    </div>
                                </td> */}
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

export default TravelAgentTransection;

