import React, { useContext, useState } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/context";

export function AddCity({ }) {
    const {tostMsg, SetTostMsg } = useContext(StoreContext)
    const brand = {
        _id: "673ef93329933f9da9d46d2a",
    };

    const [cityData, setCityData] = useState({
        agentid: brand._id,
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
            const response = await axios.post(
                "http://localhost:4000/api/admin/addcity",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.data.success) {
               SetTostMsg(response.data.message);
               navigate('/dashboard/cities')
            }else{
                 toast.error(response.data.message);
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
        } catch (error) {
            console.error("Error adding city:", error);
          SetTostMsg(error.response?.data?.message || "Failed to add city");
        }
    };

    return (
        <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
            {/* <Card className="w-full"> */}
                <Typography  variant="h2" className="font-bold text-center mb-4">
                    Add City
                </Typography>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-h-[420px] overflow-y-auto"
                >
                    <div className="pl-5 pr-5  grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* English Fields */}
                        <div className="space-y-4">
                            <Typography variant="h6" className="font-medium mb-4">
                                English Details
                            </Typography>

                           <div>
                           <label className="block text-gray-700 font-medium mb-2">Name</label>
                            <Input
                                size="lg"
                                label="Name"
                                name="name"
                                value={cityData.name}
                                onChange={handleChange}
                                required
                            />
                           </div>
                            <div className="space-y-2">
                                <Typography variant="small" className="font-medium">
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
                            <Typography variant="h6" className="font-medium mb-4">
                            التفاصيل العربية
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
                   <div className="p-5">
                   <Button type="submit" className=" w-40 bg-gray-900" color="black" fullWidth>
                        Add City
                    </Button>
                   </div>
                </form>
            {/* </Card> */}
        </div>
    );


}





export default AddCity;
