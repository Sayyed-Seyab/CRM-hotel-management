import React, { useContext, useEffect, useState } from "react";
import { RiChatDeleteFill } from "react-icons/ri";
import { BiSolidMessageAdd } from "react-icons/bi";
import {
    Card,
    Input,
    Button,
    Typography,
    Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { StoreContext } from "@/context/context";
import Facilities from "@/data/facilities";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../location/LocationPicker";


export function Addhotel() {
    const { url, agentid, cities, SetTostMsg } = useContext(StoreContext)
    console.log(cities)
    const brand = {
        agentid: "67657595591b7c8a9580623b"
    }
    const [gallery, setGallery] = useState([
        { galleryimage: "", alt: "", caption: "" },
    ]);
    // const [facilities, setFacilities] = useState([
    //     { facility: "", arabicfacility: "", facilityimage: "", alt: "", caption: "" },
    // ]);
    const [policies, setPolicies] = useState([
        {
            policyheading: "Booking Policy",
            arabicpoliylabel: "سياسة الحجز",
            arabicpolicydescription: "",
            policydescription: "",
        },
        {
            policyheading: "Cancellation Policy",
            arabicpoliylabel: "سياسة الإلغاء",
            arabicpolicydescription: "",
            policydescription: "",
        },
        {
            policyheading: "No Show Policy",
            arabicpoliylabel: "سياسة عدم الحضور",
            arabicpolicydescription: "",
            policydescription: "",
        },
    ]);
    const [location, setLocation] = useState({
        latitude: 33.6844,
        longitude: 73.0479, // Default location: Islamabad
    });
    const [formData, setFormData] = useState({
        agentid: agentid,
        bookingengineid: "",
        comment: '',
        arabiccomment: "",
        city: "",
        name: "",
        arabicname: "",
        starrating: "",
        location: location,
        address: "",
        arabicaddress: "",
        arabicnearby: "",
        nearby: "",
        minrate: "",
        ratingguest: "",
        totalratings: "",
        description: "",
        arabicdescription: "",
        facilities: [{ facility: "", arabicfacility: "", facilityimage: "", alt: "", caption: "" }],
        gallery: gallery,
        policies: policies,
        facilityheading: "",
        arabicfacilityheading: "",
        facilitydescription: "",
        arabicfacilitydescription: "",
        addedoreditedby: brand.agentid,
        featured: null,
        metaheading: "",
        metainfo: "",
    });
    const [selectedIndices, setSelectedIndices] = useState([]);
    const navigate = useNavigate()

    console.log(Facilities)

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setLocation((prevLocation) => ({
            ...prevLocation,
            [name]: value,
        }));

        // Update formData with the new location values
        setFormData((prevFormData) => ({
            ...prevFormData,
            location: {
                ...prevFormData.location,
                [name]: value,
            },
        }));
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



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

    const handleSubmit = async (e) => {
        e.preventDefault();


        const formdata = new FormData();
        console.log(formData.agentid)
        formdata.append("agentid", formData.agentid);
        formdata.append("bookingengineid", formData.bookingengineid);
        formdata.append("comment", `${formData.comment} | ${formData.arabiccomment}`);
        formdata.append("city", formData.city);
        formdata.append("name", `${formData.name} | ${formData.arabicname}`);
        formdata.append("starrating", formData.starrating)
        formdata.append("address", `${formData.address} | ${formData.arabicaddress}`);
        formdata.append("nearby", `${formData.nearby} | ${formData.arabicnearby}`);
        formdata.append("minrate", formData.minrate);
        formdata.append('ratingguest', formData.ratingguest);
        formdata.append("facilityheading", `${formData.facilityheading} | ${formData.arabicfacilityheading}`);
        formdata.append("facilitydescription", `${formData.facilitydescription} | ${formData.arabicfacilitydescription}`);
        formdata.append("description", `${formData.description} | ${formData.arabicdescription}`);
        formdata.append("addedoreditedby", formData.addedoreditedby);
        formdata.append("featured", Boolean(formData.featured));
        formdata.append("metaheading", formData.metaheading);
        formdata.append("metainfo", formData.metainfo);
        formdata.append('location[latitude]', formData.location.latitude);
        formdata.append('location[longitude]', formData.location.longitude);


        // Append gallery
        gallery.forEach((item, index) => {
            formdata.append(`galleryalt_${index}`, item.alt);
            formdata.append(`gallerycaption_[${index}`, item.caption);


            // Append images with specific names to match backend expectations
            if (item.galleryimage) {
                formdata.append('galleryimage', item.galleryimage);
            }
        });

        // Append facilities
        formData.facilities.forEach((item, index) => {
            formdata.append(`facility_${index}`, item.facility);
            formdata.append(`facilityalt_${index}`, item.alt);
            formdata.append(`facilitycaption_${index}`, item.caption);

            // Append images with specific names to match backend expectations
            if (item.facilityimage) {
                formdata.append('facilityimage', item.facilityimage);
            }
        });

        // Append policies 
        formData.policies.forEach((item, index) => {
            formdata.append(`policyheading_${index}`, `${item.policyheading} | ${item.arabicpoliylabel}`);
            formdata.append(`policydesc_${index}`, `${item.policydescription} | ${item.arabicpolicydescription}`);
            // formdata.append(`policies[${index}][policyimage]`, item.policyimage);
            // formdata.append(`policies[${index}][alt]`, item.alt);
            // formdata.append(`policies[${index}][caption]`, item.caption);
        });

        // Log the FormData values to the console
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await axios.post(
                `${url}/api/admin/addhotel/${agentid}`,
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log(response)
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/hotels')
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding hotel:", error);
            alert("Error adding hotel");
        }
    };

    const handleImageClick = async (imageUrl, imageName, arabicName, index) => {
        try {
            // Update selected indices
            setSelectedIndices((prevIndices) => {
                if (prevIndices.includes(index)) {
                    // Remove index if already selected
                    return prevIndices.filter((i) => i !== index);
                } else {
                    // Add index if not selected
                    return [...prevIndices, index];
                }
            });

            // Fetch the image and create a File object
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // Extract the file extension and sanitize the MIME type
            let extension = blob.type.split("/")[1]; // Get file extension
            if (extension.includes("+")) {
                extension = extension.split("+")[0]; // Remove "+xml" or similar
            }

            // Sanitize the MIME type (remove "+xml")
            let sanitizedType = blob.type.split("+")[0];

            // Create the File object with the sanitized type and correct extension
            const file = new File([blob], `${imageName}.${extension}`, { type: sanitizedType });
            console.log(file);


            setFormData((prevFormData) => {
                // Filter out any empty facilities objects
                const filteredFacilities = prevFormData.facilities.filter(
                    (facility) => facility.facility !== "" || facility.arabicfacility !== "" || facility.facilityimage !== ""
                );

                const facilityExists = filteredFacilities.some(
                    (facility) => facility.facility === `${imageName} | ${arabicName}`
                );

                const newFacilities = facilityExists
                    ? filteredFacilities.filter(
                        (facility) => facility.facility !== `${imageName} | ${arabicName}`
                    )
                    : [
                        ...filteredFacilities,
                        {
                            facility: `${imageName} | ${arabicName}`,
                            arabicfacility: arabicName,
                            facilityimage: file,
                            alt: `${imageName} | ${arabicName}`,
                            caption: "",
                        },
                    ];

                return { ...prevFormData, facilities: newFacilities };
            });
        } catch (error) {
            console.error("Error handling image click:", error);
        }
    };





    useEffect(() => {
        console.log(formData)
        console.log(gallery)
        console.log(formData.facilities)

    }, [formData, gallery, policies, agentid, location])

    return (
        <>
            {/* Trigger Button */}



            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">


                {/* <Card className="w-full"> */}
                <Typography variant="h2" className="text-gray-700 font-bold text-center mb-6">
                    ADD HOTEL
                </Typography>
                <form onSubmit={handleSubmit} className="p-5 space-y-8 max-h-[500px] overflow-y-auto">

                    <div className="grid grid-cols-2 gap-5">


                        {/* English form inputs */}
                        <div className=" flex flex-col gap-5">
                            {/* Basic Fields */}
                            <Typography variant="h6" className="block text-gray-700 font-medium  mb-2">
                                English details
                            </Typography>
                            <div >

                                <label className="block text-gray-700 font-medium mb-2">Hotel Name:</label>
                                <Input
                                    label="Name"
                                    name="name"
                                    size='lg'
                                    onChange={handleInputChange} required />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Description:</label>
                                <textarea
                                    name="description"
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                ></textarea>
                            </div>



                            {/* Address Input */}
                            <div className="">
                                <label className="block text-gray-700 font-medium mb-2">Address:</label>
                                <Input
                                    label="Address"
                                    name="address"
                                    size="lg"
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                />
                            </div>

                            {/* Nearby Input */}
                            <div className="">
                                <label className="block text-gray-700 font-medium mb-2">Nearby:</label>
                                <Input
                                    label="Nearby"
                                    name="nearby"
                                    size="lg"
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                />
                            </div>



                            {/* Policies Section */}
                            <div className="flex flex-col gap-3">
                                <Typography variant="h6" className=" text-gray-700 font-medium">
                                    Policies
                                </Typography>

                                {policies.map((policy, index) => (
                                    <div key={index} className="grid grid-cols-1 gap-4">
                                        <Input
                                            size="sm"
                                            label={policy.policyheading} // Predefined label
                                            value={policy.policyheading}
                                            disabled // Prevent user from changing the policy heading
                                        />
                                        <Textarea
                                            size="sm"
                                            label="Policy Description"
                                            value={policy.policydescription}
                                            onChange={(e) =>
                                                handleDynamicChange(
                                                    index,
                                                    "policydescription",
                                                    e.target.value,
                                                    setPolicies,
                                                    policies
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            <hr className="border-b-2 border-gray-700" />

                            {/* Facilities */}

                            <div className="flex flex-col gap-4">




                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Facility Heading:</label>
                                    <input
                                        type="text"
                                        name="facilityheading"
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Facility Description:</label>
                                    <textarea
                                        name="facilitydescription"
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    ></textarea>
                                </div>
                            </div>
                            <hr className="border-b-2 border-gray-700" />

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Comment:</label>
                                <textarea
                                    name="comment"
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                ></textarea>
                            </div>

                        </div>



                        {/* Arabic form inputs */}
                        {/* Arabic form inputs */}
                        <div className="">
                            {/* Basic Fields */}
                            <Typography variant="h6" className="block text-gray-700 font-medium ">
                                التفاصيل باللغة العربية
                            </Typography>
                            <div className="mt-7 flex flex-col gap-5">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">اسم الفندق:</label>
                                    <Input
                                        label="الاسم"
                                        name="arabicname"
                                        size="lg"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">الوصف:</label>
                                    <textarea
                                        name="arabicdescription"
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    ></textarea>
                                </div>
                                {/* Address Input */}
                                <div className="">
                                    <label className="block text-gray-700 font-medium mb-2">العنوان:</label>
                                    <Input
                                        label="العنوان"
                                        name="arabicaddress"
                                        size="lg"
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    />
                                </div>

                                {/* Nearby Input */}
                                <div className="">
                                    <label className="block text-gray-700 font-medium mb-2">المعالم القريبة:</label>
                                    <Input
                                        label="المعالم القريبة"
                                        name="arabicnearby"
                                        size="lg"
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    />
                                </div>

                                {/* Dynamic Arrays */}

                                {/* Policies */}
                                <div className="flex flex-col gap-3">
                                    <Typography variant="h6" className=" block text-gray-700 font-medium">
                                        السياسات
                                    </Typography>

                                    {policies.map((policy, index) => (
                                        <div key={index} className="grid grid-cols-1 gap-4">
                                            <Input
                                                size="sm"
                                                label={policy.arabicpoliylabel} // Predefined label
                                                value={policy.arabicpoliylabel}
                                                disabled // Prevent user from changing the policy heading
                                            />
                                            <Textarea
                                                size="sm"
                                                label="وصف السياسة"
                                                value={policy.arabicpolicydescription}
                                                onChange={(e) =>
                                                    handleDynamicChange(
                                                        index,
                                                        "arabicpolicydescription",
                                                        e.target.value,
                                                        setPolicies,
                                                        policies
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <hr className="border-b-2 border-gray-700" />

                                {/* Facilities */}
                                <div className="flex flex-col gap-4 ">
                                    <div className="">
                                        <label className="block  text-gray-700 font-medium mb-2">عنوان المرفق:</label>
                                        <input
                                            type="text"
                                            name="arabicfacilityheading"
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">وصف المرفق:</label>
                                        <textarea
                                            name="arabicfacilitydescription"
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                        ></textarea>
                                    </div>
                                </div>
                                <hr className="border-b-2 border-gray-700" />


                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">تعليق</label>
                                    <textarea
                                        name="arabiccomment"
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    ></textarea>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Default facilities  */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {Facilities.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleImageClick(item.img, item.name, item.arabicname, index)} // Pass image URL and name
                                className={`flex flex-wrap flex-col w-28 items-center gap-2 border-2 p-2 rounded-md ${selectedIndices.includes(index) ? "bg-gray-500" : "" // Apply gray bg for selected items
                                    } hover:bg-blue-50 cursor-pointer`}
                            >
                                {/* Image Wrapper */}
                                <div className="flex  justify-center items-center">
                                    <img
                                        src={item.img} // Assuming `item.img` contains the image URL
                                        alt={item.name} // Assuming `item.name` contains the facility name
                                        className="w-10 h-10"
                                    />
                                </div>
                                <span className="text-sm text-gray-700 text-center font-medium">{item.name}</span>
                            </div>

                        ))}

                    </div>

                    {/* map with full width */}
                    <div>
                        <LocationPicker setFormData={setFormData} location={location} setLocation={setLocation} />
                    </div>
                    {/* map with full width */}



                    {/* form footer */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* English form inputs  */}
                        <div className="flex flex-col gap-5">



                            {/* Location */}

                            <div className="grid grid-cols-1 gap-1">
                                <label className="block text-gray-700 font-medium mb-2">Location:</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <Input
                                        size="lg"
                                        label="Latitude"
                                        name="latitude"
                                        type="number"
                                        value={location.latitude}
                                        onChange={handleLocationChange}
                                        required

                                    />
                                    <Input
                                        size="lg"
                                        label="Longitude"
                                        name="longitude"
                                        type="number"
                                        value={location.longitude}
                                        onChange={handleLocationChange}
                                        required

                                    />
                                </div>
                            </div>

                            {/* cities */}
                            <div className="form-group">
                                <label className="block text-gray-700 font-medium mb-2">Select City:</label>
                                <select
                                    name="city"
                                    value={formData.city || ""} // Controlled value
                                    onChange={handleInputChange}
                                    className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                    required
                                >
                                    <option className="text-gray-700" value="" disabled>
                                        Select a City
                                    </option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city._id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Dynamic Arrays */}
                            {/* Gallery */}
                            <div className="">
                                <div>
                                    <Typography variant="h6" className="text-gray-700 font-medium mb-2">
                                        Gallery
                                    </Typography>
                                    {gallery.map((item, index) => (
                                        <div key={index} className="grid grid-cols-1 gap-4 mb-3 ">

                                            <div>
                                                <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) =>
                                                            handleDynamicChange(
                                                                index,
                                                                "galleryimage",
                                                                e.target.files[0],
                                                                setGallery,
                                                                gallery
                                                            )
                                                        }
                                                        className="hidden "
                                                    />
                                                    <span className="text-gray-700 ">
                                                        Upload Image (1000 x 500 px)
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="w-80 mb-4">
                                                {/* Image Preview */}
                                                {item.galleryimage && item.galleryimage instanceof File && (
                                                    <img
                                                        src={URL.createObjectURL(item.galleryimage)}
                                                        alt={item.alt || `Gallery image ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex gap-3 ">
                                                <div className="">
                                                    <Input
                                                        size="sm"
                                                        label="Alt"
                                                        className=""
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
                                                </div>

                                                <div className="flex gap-3">
                                                    <div className="">
                                                        <RiChatDeleteFill
                                                            onClick={() => removeField(index, setGallery, gallery)}
                                                            color="red"
                                                            className=""
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <BiSolidMessageAdd

                                                            className=""
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                            onClick={() =>
                                                                addField(setGallery, {
                                                                    galleryimage: "",
                                                                    alt: "",
                                                                    caption: "",
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-b-2 border-gray-700" />

                            {/* Star rating */}
                            <div className="">
                                <label className="block text-gray-700 font-medium mb-2">Star rating:</label>
                                <Input
                                    label="Star rating"
                                    name="starrating"
                                    size="lg"
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                />
                            </div>

                            {/* Guest rating */}
                            <div className="">
                                <label className="block text-gray-700 font-medium mb-2">Guest rating:</label>
                                <Input
                                    label="Guest rating"
                                    name="ratingguest"
                                    size="lg"
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                />
                            </div>

                            {/* Minum rate */}
                            <div className="">
                                <label className="block text-gray-700 font-medium mb-2">Manimun rate:</label>
                                <Input
                                    label="Manimum rate"
                                    name="minrate"
                                    size="lg"
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                />
                            </div>

                            {/* Minum rate */}
                            <div className="">
                                <label className="block text-gray-700 font-medium mb-2">Booking Engine Id:</label>
                                <Input
                                    label="bookingengineid"
                                    name="bookingengineid"
                                    size="lg"
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                />
                            </div>



                            {/* Other Fields */}
                            {/* <div>
    <label className="block text-gray-700 font-medium mb-2">Minimum Rate:</label>
    <input
      type="number"
      name="minrate"
      onChange={handleInputChange}
      required
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-2">Rating Guest:</label>
    <input
      type="number"
      name="ratingguest"
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-2">Total Ratings:</label>
    <input
      type="number"
      name="totalratings"
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
    />
  </div> */}




                            {/* <div>
                                            <label className="block text-gray-700 font-medium mb-2">Added or Edited By (User ID):</label>
                                            <input
                                                type="text"
                                                name="addedoreditedby"
                                                onChange={handleInputChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                            />
                                        </div> */}

                            <div >
                                <label className="block text-gray-700 font-medium mb-2">Meta title:</label>
                                <Input
                                    label="Meta heading"
                                    name="metaheading"
                                    size='lg'
                                    onChange={handleInputChange} required />
                            </div>


                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Meta description:</label>
                                <textarea
                                    name="metainfo"
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                ></textarea>
                            </div>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4">
                                <label className="block text-gray-700 font-medium">Featured:</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="featured"
                                            value="yes"
                                            checked={formData.featured === true}
                                            onChange={() => setFormData({ ...formData, featured: true })}
                                            className="w-5 h-5  border-gray-300 rounded-full  focus:ring-blue-300 focus:rounded-full"
                                        />
                                        <span className="text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="featured"
                                            value="no"
                                            checked={formData.featured === false}
                                            onChange={() => setFormData({ ...formData, featured: false })}
                                            className="w-5 h-5 text-blue-600 border border-gray-300 rounded-full  focus:ring-blue-300"
                                        />
                                        <span className="text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>


                            <div className="grid grid-cols-1">
                                <Button type="submit" className="bg-gray-900 w-full mt-5">
                                    ADD HOTEL
                                </Button>
                            </div>
                        </div>

                        <div>
                            {/* Arabic inputs */}
                        </div>
                    </div>
                </form>
                {/* </Card> */}
            </div>


        </>
    )
}

export default Addhotel;

