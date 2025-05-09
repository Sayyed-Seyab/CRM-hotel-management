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


export function UpdateHotel() {
    const {loading, url, agentid, cities, SetTostMsg, EditHotel, fetchCities } = useContext(StoreContext)
    const [id, setId] = useState()
    console.log(EditHotel)
    const brand = {
        agentid: "67657595591b7c8a9580623b"
    }

    
    const [gallery, setGallery] = useState([
        { galleryimage: "", alt: "", caption: "" },
    ]);
    const [facilities, setFacilities] = useState([
        { facility: "", arabicfacility: "", facilityimage: "", alt: "", caption: "" },
    ]);
    const [policies, setPolicies] = useState([
        {
            policyheading: "Booking Policy",
            arabicpoliylabel: "arabic Booking Policy",
            arabicpolicydescription: "",
            policydescription: "",
        },
        {
            policyheading: "Cancellation Policy",
            arabicpoliylabel: "arabic Booking Policy",
            arabicpolicydescription: "",
            policydescription: "",
        },
        {
            policyheading: "No Show Policy",
            arabicpoliylabel: "arabic Booking Policy",
            arabicpolicydescription: "",
            policydescription: "",
        },
    ]);
    const [location, setLocation] = useState({
        latitude: "",
        longitude: "", // Default location: Islamabad
    });
    const [formData, setFormData] = useState({
        agentid: agentid,
        bookingengineid:"",
        comment:'',
        arabiccomment:"",
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
        facilities:  [{ facility: "", arabicfacility: "", facilityimage: "", alt: "", caption: "" }],
        gallery: gallery,
        policies: [],
        facilityheading: "",
        arabicfacilityheading: "",
        facilitydescription: "",
        arabicfacilitydescription: "",
        addedoreditedby: brand.agentid,
        featured: null,
        metaheading: "",
        metainfo: "",
    });

    useEffect(() => {
        if (EditHotel) {
            fetchCities()
            console.log(EditHotel);
            const deepCopyEditHotel = JSON.parse(JSON.stringify(EditHotel));
            // Merge the new state with the previous state
            setFormData((prevFormData) => ({
                ...prevFormData, // Preserve previous fields
                agentid: deepCopyEditHotel[0].agentid || agentid,
                city: deepCopyEditHotel[0].city._id || "",
                name: deepCopyEditHotel[0].name?.split(" | ")[0] || "",
                arabicname: deepCopyEditHotel[0].name?.split(" | ")[1] || "",
                bookingengineid: deepCopyEditHotel[0].bookingengineid || "",
                starrating: deepCopyEditHotel[0].starrating || "",
                address: deepCopyEditHotel[0].address?.split(" | ")[0] || "",
                arabicaddress: deepCopyEditHotel[0].address?.split(" | ")[1] || "",
                arabiccomment: deepCopyEditHotel[0].comment?.split(" | ")[1] || "",
                comment: deepCopyEditHotel[0].comment?.split(" | ")[0] || "",
                nearby: deepCopyEditHotel[0].nearby?.split(" | ")[0] || "",
                arabicnearby: deepCopyEditHotel[0].nearby?.split(" | ")[1] || "",
                minrate: deepCopyEditHotel[0].minrate || "",
                ratingguest: deepCopyEditHotel[0].ratingguest || "",
                description: deepCopyEditHotel[0].description?.split(" | ")[0] || "",
                arabicdescription: deepCopyEditHotel[0].description?.split(" | ")[1] || "",
                policies: deepCopyEditHotel[0].policies?.map((policy) => ({
                    policyheading: policy.policyheading?.split(" | ")[0] || "",
                    arabicpoliylabel: policy.policyheading?.split(" | ")[1] || "",
                    policydescription: policy.policydescription?.split(" | ")[0] || "",
                    arabicpolicydescription: policy.policydescription?.split(" | ")[1] || "",
                })),
                facilities:deepCopyEditHotel[0].facilities.map((facility) => ({
                    facility: facility.facility, // Extract English text
                    arabicfacility: facility.facility?.split(" | ")[1] || "", // Extract Arabic text
                    facilityimage: facility.facilityimage || "", // Facility image
                    alt: facility.alt || "", // Alt text
                    caption: facility.caption || "", // Caption
                })),

                facilityheading: deepCopyEditHotel[0].facilityheading?.split(" | ")[0] || "",
                arabicfacilityheading: deepCopyEditHotel[0].facilityheading?.split(" | ")[1] || "",
                facilitydescription: deepCopyEditHotel[0].facilitydescription?.split(" | ")[0] || "",
                arabicfacilitydescription: deepCopyEditHotel[0].facilitydescription?.split(" | ")[1] || "",
                location: {
                    latitude: deepCopyEditHotel[0].location?.latitude || 33.6844, // Default to Islamabad if missing
                    longitude: deepCopyEditHotel[0].location?.longitude || 73.0479,
                },
                addedoreditedby: deepCopyEditHotel[0].addedoreditedby || "673ef93329933f9da9d46d2a",
                featured: deepCopyEditHotel[0].featured || false,
                metaheading: deepCopyEditHotel[0].metaheading || "",
                metainfo: deepCopyEditHotel[0].metainfo || "",
            }));
    
            // setPolicies(
            //     deepCopyEditHotel[0].policies.map((policy) => ({
            //         policyheading: policy.policyheading.split(" | ")[0] || "",
            //         arabicpoliylabel: policy.policyheading.split(" | ")[1] || "",
            //         policydescription: policy.policydescription.split(" | ")[0] || "",
            //         arabicpolicydescription: policy.policydescription.split(" | ")[1] || "",
            //     }))
            // );


            setGallery(
                deepCopyEditHotel[0].gallery.map((gallery)=>({
                    galleryimage:gallery.galleryimage,
                    alt: gallery.alt,
                }))
            )
            setLocation(
               
                    {
                    latitude: deepCopyEditHotel[0].location?.latitude || 33.6844, // Default to Islamabad if missing
                    longitude: deepCopyEditHotel[0].location?.longitude || 73.0479,
                    }
                
            )

           
              
                   
        
            
        }
      
    
        console.log(formData);
    }, []);
    
    const [selectedIndices, setSelectedIndices] = useState([]);

    useEffect(() => {
        if (EditHotel && Array.isArray(EditHotel[0]?.facilities) && Facilities) {
            // Find indices of Facilities that match EditHotel[0].facilities
            const indices = Facilities.map((staticFacility, index) => {
                const isMatched = EditHotel[0].facilities.some(
                    (storedFacility) =>
                        storedFacility.facility?.split(" | ")[0] === staticFacility.name
                );
                return isMatched ? index : null; // Return index if matched, otherwise null
            }).filter((index) => index !== null); // Remove null values
    
            setSelectedIndices(indices); // Store matched indices
        }
    }, [EditHotel, Facilities]);
    
    
    useEffect(() => {
        console.log("Matched Facility Indices:", selectedIndices);
    }, [selectedIndices]);

    const navigate = useNavigate()

    // console.log(Facilities)

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
        const updated = state.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setter(updated);
    };


    const handlePolicyChange = (index, field, value, setFormData, formData) => {
        const updatedPolicies = [...formData.policies];
        updatedPolicies[index] = {
            ...updatedPolicies[index],
            [field]: value,
        };
        setFormData({
            ...formData,
            policies: updatedPolicies,
        });
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
        formdata.append("city", formData.city);
        formdata.append("name", `${formData.name} | ${formData.arabicname}`);
        formdata.append("description", `${formData.description} | ${formData.arabicdescription}`);
        formdata.append("comment", `${formData.comment} | ${formData.arabiccomment}`);
        formdata.append("starrating", formData.starrating)
        formdata.append("address", `${formData.address} | ${formData.arabicaddress}`);
        formdata.append("nearby", `${formData.nearby} | ${formData.arabicnearby}`);
        formdata.append("minrate", formData.minrate);
        formdata.append('ratingguest', formData.ratingguest);
        formdata.append("facilityheading", `${formData.facilityheading} | ${formData.arabicfacilityheading}`);
        formdata.append("facilitydescription", `${formData.facilitydescription} | ${formData.arabicfacilitydescription}`);
        formdata.append("addedoreditedby", formData.addedoreditedby);
        formdata.append("featured", formData.featured);
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
        // Convert gallery to JSON.stringify
// const galleryData = gallery.map((item) => ({
//     galleryimage: item.galleryimage,
//     alt: item.alt,
//     caption: item.caption
// }));
// formdata.append("gallery", JSON.stringify(galleryData));

        // Append facilities
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
            const response = await axios.put(
                `${url}/api/admin/updatehotel/${EditHotel[0]._id}`,
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
           console.log(response)
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/hotels')
              
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error adding hotel:", error);
            alert("Error adding hotel");
        }
    };

    const handleImageClick = async (imageUrl, imageName, arabicName, index) => {
        try {
            // Toggle selected indices
            setSelectedIndices((prevIndices) => {
                if (prevIndices.includes(index)) {
                    return prevIndices.filter((i) => i !== index); // Deselect index
                } else {
                    return [...prevIndices, index]; // Select index
                }
            });
    
            // Fetch the image and create a File object
            const response = await fetch(imageUrl);
            const blob = await response.blob();
    
            let extension = blob.type.split("/")[1];
            if (extension.includes("+")) {
                extension = extension.split("+")[0];
            }
            const sanitizedType = blob.type.split("+")[0];
            const file = new File([blob], `${imageName}.${extension}`, { type: sanitizedType });
    
            // Add or remove the facility from the formData state
            setFormData((prevFormData) => {
                // Check if the facility already exists
                const facilityIdentifier = `${imageName} | ${arabicName}`;
                const facilityExists = prevFormData.facilities.some(
                    (facility) => facility.facility === facilityIdentifier
                );
    
                const updatedFacilities = facilityExists
                    ? prevFormData.facilities.filter(
                        (facility) => facility.facility !== facilityIdentifier
                    )
                    : [
                        ...prevFormData.facilities,
                        {
                            facility: `${imageName} | ${arabicName}` ,
                            arabicfacility: arabicName,
                            facilityimage: file,
                            alt: facilityIdentifier,
                            caption: "",
                        },
                    ];
    
                return {
                    ...prevFormData,
                    facilities: updatedFacilities,
                };
            });
        } catch (error) {
            console.error("Error handling image click:", error);
        }
    };
    

    
    
    

    useEffect(() => {
      console.log(EditHotel)
        console.log(formData)
        console.log(gallery)
        console.log(facilities)
        console.log(formData.facilities)
        console.log(policies)
       
       
    }, [formData, gallery, facilities, policies, agentid, location, loading])
    if (loading) {
        navigate("/dashboard/hotels");
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        );

        
      }
    return (
        <>
            {/* Trigger Button */}



            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">


                <Card className="w-full">
                    <Typography variant="h2" className="font-bold text-center mb-6">
                       Update Hotel
                    </Typography>
                    <form onSubmit={handleSubmit} className="p-5 space-y-8 max-h-[500px] overflow-y-auto">

                        <div className="grid grid-cols-2 gap-5">


                            {/* English form inputs */}
                            <div className=" flex flex-col gap-5">
                                {/* Basic Fields */}
                                <Typography variant="h4" className="font-bold  mb-6">
                                    English details
                                </Typography>
                                <div >

                                    <label className="block text-gray-700 font-medium mb-2">Hotel Name:</label>
                                    <Input
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        size='lg'
                                        onChange={handleInputChange} required />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Description:</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
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
                                        value={formData.address}
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
                                        value={formData.nearby}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    />
                                </div>



                                {/* Policies Section */}
                                <div className="flex flex-col gap-3">
                                    <Typography variant="h6" className="font-medium">
                                        Policies
                                    </Typography>

                                    {formData.policies.map((policy, index) => (
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
                                                    handlePolicyChange(
                                                        index,
                                                        "policydescription",
                                                        e.target.value,
                                                        setFormData,
                                                        formData
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
                                            value={formData.facilityheading}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Facility Description:</label>
                                        <textarea
                                            name="facilitydescription"
                                            value={formData.facilitydescription}
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
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                ></textarea>
                            </div>


                            </div>

                            {/* Arabic form inputs */}
                            <div className="">
    {/* Basic Fields */}
    <Typography variant="h4" className="font-bold mb-6">
        التفاصيل العربية
    </Typography>
    <div className="mt-11 flex flex-col gap-5">
        <div>
            <label className="block text-gray-700 font-medium mb-2">اسم الفندق:</label>
            <Input
                label="الاسم"
                name="arabicname"
                value={formData.arabicname}
                size="lg"
                onChange={handleInputChange}
                required
            />
        </div>

        <div>
            <label className="block text-gray-700 font-medium mb-2">الوصف:</label>
            <textarea
                name="arabicdescription"
                value={formData.arabicdescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
            ></textarea>
        </div>
        
        {/* Address Input */}
        <div>
            <label className="block text-gray-700 font-medium mb-2">العنوان:</label>
            <Input
                label="العنوان"
                name="arabicaddress"
                value={formData.arabicaddress}
                size="lg"
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
            />
        </div>

        {/* Nearby Input */}
        <div>
            <label className="block text-gray-700 font-medium mb-2">الأماكن القريبة:</label>
            <Input
                label="الأماكن القريبة"
                name="arabicnearby"
                value={formData.arabicnearby}
                size="lg"
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
            />
        </div>

        {/* Policies */}
        <div className="flex flex-col gap-3">
            <Typography variant="h6" className="font-medium">
                السياسات
            </Typography>

            {formData.policies.map((policy, index) => (
                <div key={index} className="grid grid-cols-1 gap-4">
                    <Input
                        size="sm"
                        // label={policy.arabicpoliylabel} // Predefined Arabic label
                        value={ policy.arabicpoliylabel}
                        disabled
                        // onChange={(e) =>
                        //     handlePolicyChange(
                        //         index,
                        //         "arabicpoliylabel",
                        //         e.target.value,
                        //         setFormData,
                        //         formData
                        //     )
                        // }
                    />
                    <Textarea
                        size="sm"
                        label="وصف السياسة"
                        value={policy.arabicpolicydescription}
                        onChange={(e) =>
                            handlePolicyChange(
                                index,
                                "arabicpolicydescription",
                                e.target.value,
                                setFormData,
                                formData
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
                <label className="block text-gray-700 font-medium mb-2">عنوان المرافق:</label>
                <input
                    type="text"
                    name="arabicfacilityheading"
                    value={formData.arabicfacilityheading}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">وصف المرافق:</label>
                <textarea
                    name="arabicfacilitydescription"
                    value={formData.arabicfacilitydescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                ></textarea>
            </div>
        </div>
        <hr className="border-b-2 border-gray-700" />
        <div>
            <label className="block text-gray-700 font-medium mb-2">التعليق:</label>
            <textarea
                name="arabiccomment"
                value={formData.arabiccomment}
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
    onClick={() => handleImageClick(item.img, item.name, item.arabicname ,index)} // Pass image URL and name
    className={`flex flex-col w-28 items-center gap-2 border-2 p-2 rounded-md ${
        selectedIndices.includes(index) ? "bg-gray-500" : "" // Apply gray bg for selected items
    } hover:bg-blue-50 cursor-pointer`}
>
    {/* Image Wrapper */}
    <div className="flex justify-center items-center">
        <img
            src={item.img} // Assuming `item.img` contains the image URL
            alt={item.name} // Assuming `item.name` contains the facility name
            className="w-10 h-10"
        />
    </div>
    <span className="text-sm text-center font-medium">{item.name}</span>
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
                                    <label className="block text-gray-700 font-medium mb-2">Select City</label>
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
                                        <Typography variant="h6" className="font-medium mb-2">
                                           Update Gallery
                                        </Typography>
                                        {gallery.map((item, index) => (
                                            <div key={index} className="grid grid-cols-1 gap-4">

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
                                                        className="hidden"
                                                    />
                                                    <span className="text-gray-700">
                                                        Choose files
                                                    </span>
                                                </label>
                                               </div>
                                               <div className="w-80 mb-4">
    {item.galleryimage &&
        (item.galleryimage instanceof File ? (
            // Show image preview from File object
            <img
                src={URL.createObjectURL(item.galleryimage)}
                alt={item.alt || `Gallery image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
            />
        ) : (
            // <div></div>
            // Show image preview from URL
            <img
                src={`${url}/Images/${item.galleryimage}`}
                alt={item.galleryimage || `Gallery image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
            />
        ))}
</div>


                                                <div className="flex gap-3 mb-2 ">
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
                                        value={formData.starrating}
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
                                        value={formData.ratingguest}
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
                                        value={formData.minrate}
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
                                                                    value={formData.bookingengineid}
                                                                    size="lg"
                                                                    onChange={handleInputChange}
                                                                    // required
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
                                        value={formData.metaheading}
                                        size='lg'
                                        onChange={handleInputChange} required />
                                </div>


                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Meta description:</label>
                                    <textarea
                                        name="metainfo"
                                        value={formData.metainfo}
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
                                                value={formData.featured}
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
                                       UPDATE HOTEL
                                    </Button>
                                </div>
                            </div>

                            <div>
                                {/* Arabic inputs */}
                            </div>
                        </div>
                    </form>
                </Card>
            </div>


        </>
    )
}

export default UpdateHotel;



