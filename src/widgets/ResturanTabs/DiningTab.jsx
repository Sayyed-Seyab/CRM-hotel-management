import { StoreContext } from '@/context/context'
import { Avatar, Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function DiningTab() {
    const {url , Restaurants, language, diningId } = useContext(StoreContext)
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate()

    const rowsPerPage = 5; // Number of rows per page
    // Pagination logic
    const totalPages = Math.ceil(Restaurants.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const Data = Restaurants.slice(startIndex, startIndex + rowsPerPage);
    const currentData = Data.filter((dining) => dining._id === diningId);
    console.log(currentData);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const reDirect = ()=>{
        navigate('/dashboard/restaurants')
    }

    useEffect(()=>{
console.log(currentData[0].dining[0].diningimage.url)
    },[url, language,])
  return (
    <>
    <div className="mt-12 mb-8 flex flex-col gap-12">
    <Card>
    <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-8 p-6 flex justify-between"
                >
                    <Typography variant="h6" color="white">
                       Dining Table
                    </Typography>

                    <div className="flex items-center gap-4">
                        {/* Trigger Button */}
                        <Button
                            variant="text"
                            color="light-gray"
                            onClick={reDirect}
                            className="bg-gray-500 hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
                        >
                            Restaurants
                        </Button>
                    </div>
                </CardHeader>
     <CardBody className="max-h-[415px] overflow-y-auto px-0 pt-0 pb-2">
     <table className="w-full min-h-[0px] table-auto">
                    <thead>
                        <tr>
                            {["Image", "Name"].map((header) => (
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
                        {currentData.map((restaurant, restaurantIndex) => (
                            restaurant.dining?.map((item, index) => (
                                <tr key={index}>
                                    {/* Image */}
                                    <td className="px-5 p-4 border-b border-blue-gray-50">
                                        <Avatar
                                            src={item.diningimage ? `${url}/Images/${item.diningimage.url}` : "/path/to/placeholder.jpg"}
                                            alt={item.diningimage.url}
                                            size="lg"
                                            variant="rounded"
                                            className="w-20"
                                        />
                                    </td>

                                    {/* item Name */}
                                    <td className="px-5 p-4 border-b border-blue-gray-50 min-h-[100px]">
                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                            {item.heading}
                                        </Typography>
                                    </td>
                                </tr>
                            ))
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
   
                </>
  )
}
