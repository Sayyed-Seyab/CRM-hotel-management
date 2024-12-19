import React, { useContext, useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import { StoreContext } from "@/context/context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export function UpdateCityModal() {
    const { url, EditCity, SetEditCity, tostMsg,  SetTostMsg } = useContext(StoreContext);
    const [cityData, setCityData] = useState({
        agentid: "673ef93329933f9da9d46d2a",
        name: "",
        cityimage: null,
        alt: "",
        caption: "",
        description: "",
        arabicName: "",
        arabicDescription: "",
    });
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    // Prefill form if EditCity is provided
    useEffect(() => {
        if (EditCity && EditCity.length > 0) {
            const city = EditCity[0];
            setCityData({
                agentid: city.agentid || "673ef93329933f9da9d46d2a",
                name: city.name.split(" | ")[0] || "",
                cityimage: null,
                alt: city.alt || "",
                caption: city.caption?.split(" | ")[0] || "",
                description: city.description?.split(" | ")[0] || "",
                arabicName: city.name?.split(" | ")[1] || "",
                arabicDescription: city.description?.split(" | ")[1] || "",
                cityimage: city.cityimage,
            });
            setPreviewImage(`${url}/images/${city.cityimage}` || null);
        }
    }, [EditCity, url]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCityData({ ...cityData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCityData({ ...cityData, cityimage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("agentid", cityData.agentid);
        formData.append("name", `${cityData.name} | ${cityData.arabicName}`);
        formData.append("alt", cityData.alt);
        formData.append("caption", cityData.caption);
        formData.append(
            "description",
            `${cityData.description} | ${cityData.arabicDescription}`
        );
        if (cityData.cityimage) {
            formData.append("cityimage", cityData.cityimage);
        }

        try {
            const endpoint = `${url}/api/admin/updatecity/${EditCity[0]._id}`;
            const response = await axios.put(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/cities')
            }

            setCityData({
                name: "",
                cityimage: null,
                alt: "",
                caption: "",
                description: "",
                arabicName: "",
                arabicDescription: "",
            });
            setPreviewImage(null);
            SetEditCity(null);
        } catch (error) {
            console.error("Error updating city:", error);
            toast.error(response.data.message)
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === "overlay") {
            setIsUpdateCityModalOpen(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
           
            

            
           
               
                    <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
                        {/* <Card className="w-full"> */}
                            <Typography variant="h2" className="font-bold text-center mb-4">
                                Update City
                            </Typography>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 max-h-[420px] overflow-y-auto"
                            >
                                <div className="m-5  grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* English Fields */}
                                    <div className="space-y-4">
                                        <Typography variant="h6" className="text-gray-700 font-medium mb-4">
                                            English Details
                                        </Typography>

                                       <div>
                                       <label className="block text-gray-700 font-medium mb-2">Name</label>
                                        <Input
                                            size="lg"
                                            label="City Name"
                                            name="name"
                                            value={cityData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                       </div>
                                        <div className="space-y-2">
                                            <Typography
                                                variant="small"
                                                className="text-gray-700 font-medium"
                                            >
                                                City Image
                                            </Typography>
                                            <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <span className="text-gray-700">Choose a file</span>
                                            </label>
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt="Selected City"
                                                    className="mt-4 h-32 w-full object-cover rounded-lg border"
                                                />
                                            )}
                                        </div>
                                        <Input
                                            size="lg"
                                            label="Alt Text"
                                            name="alt"
                                            value={cityData.alt}
                                            onChange={handleChange}
                                            required
                                        />
                                      
                                     <div>
                                     <label className="block text-gray-700 font-medium mb-2">Description</label>
                                        <Textarea
                                            label="Description"
                                            name="description"
                                            value={cityData.description}
                                            onChange={handleChange}
                                        />
                                     </div>
                                    </div>

                                    {/* Arabic Fields */}
                                    <div className="space-y-4">
                                        <Typography
                                            variant="h6"
                                            className="text=gray-700 font-medium mb-4"
                                        >
                                            Arabic Details
                                        </Typography>

                                       <div>
                                       <label className="block text-gray-700 font-medium mb-2">اسم</label>
                                        <Input
                                            size="lg"
                                            label="اسم"
                                            name="arabicName"
                                            value={cityData.arabicName}
                                            onChange={handleChange}
                                            required
                                        />
                                       </div>

                                      <div>
                                      <label className="block text-gray-700 font-medium mb-2">وصف</label>
                                        <Textarea
                                            label="وصف"
                                            name="arabicDescription"
                                            value={cityData.arabicDescription}
                                            onChange={handleChange}
                                        />
                                      </div>

                                    </div>
                                </div>

                                {/* Submit Button */}
                               <div className="m-5 ">
                               <Button type="submit" className="mb-5 bg-gray-900 w-40"  fullWidth>
                                    Update City
                                </Button>
                               </div>
                            </form>
                        {/* </Card> */}
                    </div>
               
           
        </>
    );
}

export default UpdateCityModal;
