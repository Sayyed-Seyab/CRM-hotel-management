import { Button, Card, Textarea, Typography, Input } from '@material-tailwind/react';
import { RiChatDeleteFill } from "react-icons/ri";
import { BiImageAdd } from "react-icons/bi";
import { BiSolidMessageAdd } from "react-icons/bi";

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { StoreContext } from '@/context/context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddRoom() {
    const { url, agentid, SetTostMsg, hotels } = useContext(StoreContext)
    const navigate = useNavigate()

    const [gallery, setGallery] = useState([
        { galleryimage: "", alt: "", caption: "" },
    ]);

    const [amenities, setAmenities] = useState([
        { english: "", arabic: "" },  // Initialize with empty English and Arabic fields
    ])
    const handleDynamicChange = (index, field, value, setter, state) => {
        const updated = [...state];
        updated[index][field] = value;
        setter(updated);
    };

    const addField = (setter, defaultValue) => {
        setter((prev) => [...prev, defaultValue]);
    };

    const removeField = (index, setter, state) => {
        if (index > 0) {
            const updated = state.filter((_, i) => i !== index);
            setter(updated);
        }
    };


    const [roomData, setRoomData] = useState({
        agentid: agentid,
        hotelid: "",
        name: "",
        gallery: gallery,
        ratepernight: "",
        maxoccupancy: "",
        maxbookable: "",
        maxbookabletravelagent: "",
        amenities: "",
        arabicName: "",
        arabicAmenities: "",
    });
    const [previewImages, setPreviewImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();

        formdata.append("agentid", roomData.agentid);
        formdata.append("hotelid", roomData.hotelid);
        formdata.append("name", `${roomData.name} | ${roomData.arabicName}`);
        formdata.append("ratepernight", roomData.ratepernight);
        formdata.append("maxoccupancy", roomData.maxoccupancy);
        formdata.append("maxbookable", roomData.maxbookable);
        formdata.append("maxbookabletravelagent", roomData.maxbookabletravelagent);

         // Validate amenities before creating FormData
    if (!amenities.length) {
        return toast.error("Please add at least one amenity.");
    }

    for (let i = 0; i < amenities.length; i++) {
        const item = amenities[i];
        if (!item.english || !item.arabic) {
            return toast.error(
                `Both English and Arabic names are required.`
            );
        }
    }
        // Append amenities as an array of objects
        const amenitiesArray = amenities.map((item) => ({
            amenities: `${item.english} | ${item.arabic}`,
        }));

        // Append the amenities array as a JSON string
        formdata.append('amenities', JSON.stringify(amenitiesArray));



        // Append gallery
        roomData.gallery.forEach((item, index) => {
            formdata.append(`galleryalt_${index}`, item.alt);
            formdata.append(`gallerycaption_[${index}`, item.caption);


            // Append images with specific names to match backend expectations
            if (item.galleryimage) {
                formdata.append('galleryimage', item.galleryimage);
            }
        });

        // Log FormData keys and values
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await axios.post(
                `${url}/api/admin/addroom`,
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/rooms')
            } else {
             toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding room:", error);
            alert("Error adding room");
        }
    };


    useEffect(() => {
        console.log(roomData)
        console.log(gallery)
        console.log(amenities)
    }, [roomData, gallery, amenities])

    return (
        <div>

            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
                {/* <Card className="w-full"> */}
                    <Typography variant="h2" className="font-bold block text-gray-700  text-center mb-2">
                        Add Room
                    </Typography>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 max-h-[600px] overflow-y-auto"
                    >
                        <div className="pl-5 pr-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* English Fields */}
                            <div className="space-y-4">
                                <Typography variant="h6" className="block text-gray-700  font-medium mb-2">
                                    English Details
                                </Typography>
                               <div>
                               <label className="block text-gray-700 font-medium mb-2">Name</label>
                                <Input
                                    size="lg"
                                    label="Name"
                                    name="name"
                                    value={roomData.name}
                                    onChange={handleChange}
                                    required
                                />
                               </div>

                               {/* amenties */}
                                <div className="space-y-4">
                                    
                               
                                   <div>
                                   <label className="block text-gray-700 font-medium mb-2 ">Amenties</label>
                                   {amenities.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <Input
                                                size="sm"
                                                label="Ameniti"
                                                value={item.english}
                                                onChange={(e) =>
                                                    handleDynamicChange(index, "english", e.target.value, setAmenities, amenities)
                                                }
                                            />
                                            <RiChatDeleteFill
                                                onClick={() => removeField(index, setAmenities, amenities)}
                                                color="red"
                                                style={{ fontSize: '20px', cursor: 'pointer' }}
                                            />

                                            <BiSolidMessageAdd
                                                onClick={() =>
                                                    addField(setAmenities, { english: "", arabic: "" })
                                                }
                                                className=""
                                                style={{ fontSize: '20px', cursor: 'pointer' }}


                                            />
                                        </div>
                                    ))}
                                   </div>

                                </div>

                                {/* hotels */}
                                <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-2">Select Hotel</label>
                                    <select
                                        name="hotelid"
                                        onChange={handleChange}
                                        className="w-full border  text-gray-700 font-medium border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a Hotel
                                        </option>
                                        {hotels.map((hotel, index) => (
                                            <option key={index} value={hotel._id}>
                                                {hotel.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                
                                <div>
                                <label className="block text-gray-700 font-medium mb-2">Price per Night</label>
                                <Input
                                    size="lg"
                                    label="Price per Night"
                                    name="ratepernight"
                                    type="number"
                                    value={roomData.ratepernight}
                                    onChange={handleChange}
                                    required
                                />
                                </div>

                                
                               

                                
                              <div>
                                 <label className="block text-gray-700 font-medium mb-2">Maximun Occupancy</label>
                                <Input
                                    size="lg"
                                    label="Maximum Occupancy"
                                    name="maxoccupancy"
                                    type="number"
                                    value={roomData.maxoccupancy}
                                    onChange={handleChange}
                                    required
                                />
                              </div>

                             <div>
                             <label className="block text-gray-700 font-medium mb-2">Max Bookable</label>
                                <Input
                                    size="lg"
                                    label="Max Bookable"
                                    name="maxbookable"
                                    type="number"
                                    value={roomData.maxbookable}
                                    onChange={handleChange}
                                    required
                                />
                             </div>

                            <div>
                            <label className="block text-gray-700 font-medium mb-2">Max bookable for Travel-agent</label>
                                <Input
                                    size="lg"
                                    label="Max Bookable for Travel Agent"
                                    name="maxbookabletravelagent"
                                    type="number"
                                    value={roomData.maxbookabletravelagent}
                                    onChange={handleChange}
                                    required
                                />
                            </div>



                                {/* gallery */}
                                <div className="space-y-4">
                               <div>
                               <label className="block text-gray-700 font-medium mb-2">Gallery</label>
                                    {gallery.map((item, index) => (
                                        <div key={index} className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                {/* File Input */}
                                                <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleDynamicChange(
                                                                index,
                                                                "galleryimage",
                                                                e.target.files[0],
                                                                setGallery,
                                                                gallery
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                    <span className="text-gray-700">Upload Image (1000 x 500 px)</span>
                                                </label>

                                                 {/* Image Preview */}
                                                 {item.galleryimage && item.galleryimage instanceof File && (
                                                    <div className="w-80 mb-2">
                                                        <img
                                                            src={URL.createObjectURL(item.galleryimage)}
                                                            alt={item.alt || `Gallery image ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex gap-5 mb-3">
                                                    {/* Alt Text Input */}
                                                    <Input
                                                        size="sm"
                                                        label="Alt"
                                                        value={item.alt}
                                                        onChange={(e) =>
                                                            handleDynamicChange(index, "alt", e.target.value, setGallery, gallery)
                                                        }
                                                    />
                                                    {/* Add and Remove Buttons */}
                                                    <div className="flex gap-3">
                                                        <RiChatDeleteFill
                                                            onClick={() => removeField(index, setGallery, gallery)}
                                                            color="red"
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                        />
                                                        <BiSolidMessageAdd
                                                            onClick={() =>
                                                                addField(setGallery, {
                                                                    galleryimage: "",
                                                                    alt: "",
                                                                    caption: "",
                                                                })
                                                            }
                                                            
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </div>



                                               


                                            </div>
                                        </div>
                                    ))}
                               </div>

                                </div>

                            </div>

                            {/* Arabic Fields */}
                            <div className="space-y-4">
                                <Typography variant="h6" className="block text-gray-700 font-medium mb-2">
                                    التفاصيل العربية
                                </Typography>

                                <div>
                                <label className="block text-gray-700 font-medium mb-2">اسم</label>
                                <Input
                                    size="lg"
                                    label="اسم"
                                    name="arabicName"
                                    value={roomData.arabicName}
                                    onChange={handleChange}
                                    required
                                />
                                </div>
                                <div className="spy-y-4 gap-4">
                               <div>
                               <label className="block text-gray-700 font-medium mb-2">
                                    وسائل الراحة
                                    </label>
                                    {amenities.map((item, index) => (
                                        <div key={index} className="flex gap-4 mb-4">
                                            <Input
                                                size="sm"
                                                label="Arabic"
                                                value={item.arabic}
                                                onChange={(e) =>
                                                    handleDynamicChange(index, "arabic", e.target.value, setAmenities, amenities)
                                                }
                                            />

                                        </div>
                                    ))}
                               </div>

                                </div>

                            </div>
                        </div>




                        {/* Submit Button */}
                        <div className="p-5">
                            <Button type="submit" className="w-40 bg-gray-900" color="black" fullWidth>
                                ADD ROOM
                            </Button>
                        </div>
                    </form>
                {/* </Card> */}
            </div>

        </div>
    )
}
