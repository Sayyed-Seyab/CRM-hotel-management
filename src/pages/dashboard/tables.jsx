import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Tables() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]); // State for cities data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page
  const agentid = "673ef93329933f9da9d46d2a"; // Replace with dynamic agentid if needed
  const url = "http://localhost:4000";
  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/admin/getcities/${agentid}`
        );
        setCities(response.data.message);
        console.log(response.data.message)
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [agentid]);

  // Pagination logic
  const totalPages = Math.ceil(cities.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = cities.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddCity = () => {
    navigate("/dashboard/add-city");
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between"
        >
          <Typography variant="h6" color="white">
            Cities Table
          </Typography>
          <Button
            variant="text"
            color="light-gray"
            onClick={handleAddCity}
            className="bg-gray-500 hover:bg-gray-600 text-white hidden items-center gap-1 px-4 xl:flex normal-case"
          >
            <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            Add City
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Alt Text", "Caption", "Description", "Image"].map(
                  (header) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.map((city, index) => (
                <tr key={index}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold"
                    >
                      {city.name}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {city.alt}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {city.caption}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {city.description}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    {city.cityimage && (
                      <Avatar
                        src={`http://localhost:4000/Uploads/${city.cityimage}`}
                        alt={city.name}
                        size="sm"
                        variant="rounded"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sm"
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  variant={currentPage === index + 1 ? "gradient" : "text"}
                  color={currentPage === index + 1 ? "blue" : "gray"}
                  className="text-sm"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-sm"
            >
              Next
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
