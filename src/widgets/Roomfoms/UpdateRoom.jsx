import {
    Button,
    Card,
    Textarea,
    Typography,
    Input,
} from "@material-tailwind/react";
import { RiChatDeleteFill } from "react-icons/ri";
import { BiSolidMessageAdd } from "react-icons/bi";


import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "@/context/context";
import { useNavigate } from "react-router-dom";

export default function UpdateRoom() {
    const {loading, url, agentid, SetTostMsg, hotels, Editroom, cities } = useContext(StoreContext);
    const navigate = useNavigate();
   


    const [gallery, setGallery] = useState([
        { galleryimage: "", alt: "", caption: "" },
    ]);

    const [amenities, setAmenities] = useState([
        { english: "", arabic: "" },  // Initialize with empty English and Arabic fields
    ])

    const handleDynamicChange = (index, field, value, setter, state) => {
        const updated = [...state];
        if (field === "galleryimage") {
            // Append new file if it exists, without removing existing files
            updated[index][field] = value instanceof File ? value : updated[index][field];
        } else {
            updated[index][field] = value;
        }
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
        ratepernight: "",
        maxoccupancy: "",
        maxbookable: "",
        maxbookabletravelagent: "",
        amenities: amenities,
        arabicName: "",
        arabicAmenities: "",
    });

    useEffect(() => {
      
        if (Editroom) {
            console.log(Editroom);
            setRoomData({
                agentid: Editroom[0].agentid || agentid,
                hotelid: Editroom[0].hotelid || "",
                name: Editroom[0].name?.split(" | ")[0] || "",
                arabicName: Editroom[0].name?.split(" | ")[1] || "",
                ratepernight: Editroom[0].ratepernight || "",
                maxoccupancy: Editroom[0].maxoccupancy || "",
                maxbookable: Editroom[0].maxbookable || "",
                maxbookabletravelagent: Editroom[0].maxbookabletravelagent || "",

                // arabicAmenities: Editroom[0].amenities?.split(" | ")[1] || "",
            });

            setAmenities(
                Editroom[0].amenities.map((item) => {
                    const [english, arabic] = item.amenities.split(" | "); // Destructure and split by '|'
                    return { english: english.trim(), arabic: arabic?.trim() || "" }; // Ensure no undefined errors
                }) || []
            )

            setGallery(
                Editroom[0].gallery?.map((item) => ({
                    galleryimage: item.galleryimage, // Set to null initially; will be updated if a file is uploaded
                    alt: item.alt || "",
                    caption: item.caption || "",
                })) || []
            );
        }

    }, [Editroom]);
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
        const amenitiesArray = amenities.map((item) => ({
            amenities: `${item.english} | ${item.arabic}`,
        }));

        // Append the amenities array as a JSON string
        formdata.append('amenities', JSON.stringify(amenitiesArray));

        // Append gallery
        gallery.forEach((item, index) => {
            formdata.append(`galleryalt_${index}`, item.alt);
            formdata.append(`gallerycaption_[${index}`, item.caption);


            // Append images with specific names to match backend expectations
            if (item.galleryimage) {
                formdata.append('galleryimage', item.galleryimage);
            }
        });

        // Log the FormData values to the console
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await axios.put(
                `${url}/api/admin/updateroom/${Editroom[0]._id}`,
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
          
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate("/dashboard/rooms");
            } else {
                alert(response.data);
            }
        } catch (error) {
            console.error("Error updating room:", error);
            alert("Error updating room");
        }
    };



    useEffect(() => {
        console.log(roomData)
        console.log(gallery)
    }, [roomData, gallery, loading])

    if (loading) {
        navigate("/dashboard/rooms");
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        );

        
      }

    return (
        <div>
            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
                {/* <Card className="w-full"> */}
                <Typography variant="h2" className="block text-gray-700  font-bold text-center mb-4">
                    Update Room
                </Typography>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-h-[600px] overflow-y-auto"
                >
                    <div className="pl-5 pr-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* English Details */}
                        <div className="space-y-4">
                            <Typography variant="h6" className="block text-gray-700 font-medium mb-4">
                                English Details
                            </Typography>
                            <Typography variant="h6" className="block text-gray-700  font-medium ">Name</Typography>
                            <Input
                                size="lg"
                                label="Name"
                                name="name"
                                value={roomData.name}
                                onChange={handleChange}
                                required
                            />

                            {/* amenties */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 ">Amenties</label>
                                    {amenities.map((item, index) => (
                                        <div key={index} className="flex gap-4 mb-3">
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
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Select Hotel
                                </label>
                                <select
                                    name="hotelid"
                                    value={roomData.hotelid || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                    required
                                >
                                    <option className="text-gray-700" value="" disabled>
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


                            {/* Gallery Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Gallery</label>
                                    <span className="block text-gray-700 font-medium mb-2">Gallery can be updated by selecting file</span>
                                    {gallery.map((item, index) => (
                                        <div key={index} className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
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

                                                <div className="w-80 mb-4">
                                                    {/* Image Preview */}
                                                    {item.galleryimage ? (
                                                        item.galleryimage instanceof File ? (
                                                            <img
                                                                src={URL.createObjectURL(item.galleryimage)}
                                                                alt={item.alt || `Gallery image`}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={`${url}/Images/${item.galleryimage}`}
                                                                alt={item.alt || `Gallery image`}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                        )
                                                    ) : (
                                                        <div className="w-full h-32 flex items-center justify-center border rounded-lg">
                                                            <span></span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-5 mb-3">
                                                    <Input
                                                        size="sm"
                                                        label="Alt"
                                                        value={item.alt}
                                                        onChange={(e) =>
                                                            handleDynamicChange(
                                                                index,
                                                                "alt",
                                                                e.target.value,
                                                                setGallery,
                                                                gallery
                                                            )
                                                        }
                                                    />
                                                    <div className="flex gap-3">
                                                        <RiChatDeleteFill
                                                            onClick={() => removeField(index, setGallery, gallery)}
                                                            color="red"
                                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                                        />
                                                        <BiSolidMessageAdd
                                                            onClick={() =>
                                                                addField(setGallery, {
                                                                    galleryimage: "",
                                                                    alt: "",
                                                                    caption: "",
                                                                })
                                                            }
                                                          
                                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Arabic Details */}
                        <div className="space-y-4">
                            <Typography variant="h6" className="font-medium mb-4">
                                التفاصيل العربية
                            </Typography>

                            <div>
                                <label className="block text-gray-700 font-medium mb-4">اسم</label>
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
                                        <div key={index} className="flex gap-4 mb-3">
                                            <Input
                                                size="sm"
                                                label="وسائل الراحة"
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
                        <Button
                            type="submit"
                            className="w-40 bg-gray-900"
                            color="black"
                            fullWidth
                        >
                            UPDATE ROOM
                        </Button>
                    </div>
                </form>

                {/* </Card> */}
            </div>
        </div>
    );
}

