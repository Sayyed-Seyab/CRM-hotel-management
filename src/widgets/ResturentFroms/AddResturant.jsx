import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Textarea, Typography, Input } from '@material-tailwind/react';
import { RiChatDeleteFill } from "react-icons/ri";

import axios from 'axios';
import { StoreContext } from '@/context/context';
import { useNavigate } from 'react-router-dom';
import { BiSolidMessageAdd } from "react-icons/bi";
import { toast } from 'react-toastify';

export default function AddRestaurant() {
    const { url, agentid, SetTostMsg, hotels, Restaurants, cities } = useContext(StoreContext);
    const navigate = useNavigate();
    const [gallery, setgallery] = useState([{ resturantimage: "", alt: "", caption: "" }])
    const [diningdata, setdiningdata] = useState([{
        heading: "",
        arabicheading:"",
        arabicdesc:"",
        desc: "",
        diningimageurl: "",
        diningalt: "",
        diningcaption: "",
        backgroundurl: "",
        backgroundalt: "",
        backgroundcaption: "",
    }],)

    const [cuisines, setcuisines] = useState([{
        cuisinename: "",
        arabiccuisinename:"",
        cuisineimageurl: "",
        cuisinealt: "",
        cuisinecaption: "",
    }])
    const [cuisinedata, setcuisinedata] = useState({
        agentid: agentid,
        hotelid: "",
        cityid:"",
        name: "",
        arabicname:"",
        arabicdescription:'',
        description: "",
        getdirection:"",
        restaurantimage: gallery,
        dining: diningdata,
        cuisines: cuisines,
    });
    const [urlError,setUrlError ] = useState('')
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

    const handleNestedChange = (index, nestedField, field, value, setter, state) => {
        const updated = [...state];
        updated[index][nestedField][field] = value;
        setter(updated);
    };

    const validateURL = (url) => {
        const urlPattern = new RegExp(
            "^(https?:\\/\\/)?" + // Protocol (http or https)
            "((([a-zA-Z0-9_-]+\\.)+[a-zA-Z]{2,})|" + // Domain name
            "localhost|" + // Allow localhost
            "\\d{1,3}(\\.\\d{1,3}){3})" + // OR IPv4
            "(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" + // Port and path
            "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // Query string
            "(\\#[-a-zA-Z0-9_]*)?$", // Fragment
            "i"
        );
        return urlPattern.test(url);
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "getdirection") {
            if (!validateURL(value)) {
                setUrlError("Please enter a valid URL.");
            } else {
                setUrlError(""); // Clear the error
            }
        }
        setcuisinedata((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         // Validate cuisine fields before creating FormData
    for (let i = 0; i < cuisinedata.cuisines.length; i++) {
        const item = cuisinedata.cuisines[i];

        // Validate cuisinename
        if (!item.cuisinename || !item.cuisinename.trim()) {
            return toast.error(`Cuisine name is required at ${i + 1} field.`);
        }

        // // Validate cuisineimageurl
        // if (!item.cuisineimageurl) {
        //     return toast.error(`Cuisine image is ad required  ${i + 1} field.`);
        // }

        // // Check if the image URL is a valid image file (could add further validation for actual file type if needed)
        // if (!item.cuisineimageurl.match(/\.(jpg|jpeg|png|gif)$/)) {
        //     return toast.error(`Cuisine image at  ${i + 1} field must be a valid image (jpg, jpeg, png, gif).`);
        // }
    }

    
        const formdata = new FormData();
    
        // Append top-level fields
        formdata.append("agentid", cuisinedata.agentid);
        formdata.append("cityid", cuisinedata.cityid);
        formdata.append("hotelid", cuisinedata.hotelid);
        formdata.append("name", `${cuisinedata.name} | ${cuisinedata.arabicname}`);
        formdata.append("description", `${cuisinedata.description} | ${cuisinedata.arabicdescription}`);
        formdata.append("getdirection", cuisinedata.getdirection);
    
        // Append nested fields for restaurant images
        cuisinedata.restaurantimage.forEach((item, index) => {
            formdata.append('resturantimage', item.resturantimage);
            formdata.append(`resturantimagealt_${index}`, item.alt);
            formdata.append(`resturantimagecaption_${index}`, item.caption);
           
        });
    
        // Append nested fields for dining
        // cuisinedata.dining.forEach((item, index) => {
        //     formdata.append(`dheading_${index}`, `${item.heading} | ${item.arabicheading}`);
        //     formdata.append(`desc_${index}`, `${item.desc} | ${item.arabicdesc}`);
        //     formdata.append('diningimage', item.diningimageurl);
        //     formdata.append(`diningimagealt_${index}`, item.diningalt);
        //     formdata.append(`diningimagecaption_${index}`, item.diningcaption);
        //     formdata.append('backgroundimage', item.backgroundurl);
        //     formdata.append(`backgroundimagealt_${index}`, item.backgroundalt);
        //     formdata.append(`backgroundimagecaption_${index}`, item.backgroundcaption);
        // });
    
        // Append nested fields for cuisines
        cuisinedata.cuisines.forEach((item, index) => {
            formdata.append(`cuisinename_${index}`, `${item.cuisinename} | ${item.arabiccuisinename}`);
            formdata.append('cuisineimage', item.cuisineimageurl);
            formdata.append(`cuisineimagealt_${index}`, item.cuisinealt);
            formdata.append(`cuisineimagecaption_${index}`, item.cuisinecaption);
        });

         // Log FormData keys and values
         for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await axios.post(
                `${url}/api/admin/addresturant`,
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/restaurants');
               
            } else {
                 toast(response.data.message);
            }
        } catch (error) {
            console.error("Error adding restaurant:", error);
            alert("Error adding restaurant");
        }
    };
    

    useEffect(() => {
        console.log(cuisinedata)
        console.log(cuisines)
        console.log(diningdata)
        console.log(gallery)

    }, [cuisines, diningdata, gallery, cuisinedata])

    return (
        <div>
            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
                {/* <Card className="w-full"> */}
                    <Typography variant="h2" className="font-bold text-gray-700 text-center mb-4">
                        Add Restaurant
                    </Typography>
                    {/* form */}
                    <form onSubmit={handleSubmit} className="space-y-6 max-h-[600px] overflow-y-auto">
                        <div className="pl-5 pr-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4 grid-cols-1  gap-4">
                                <Typography variant="h6" className=" text-gray-700 font-medium mb-4">
                                    English Details
                                </Typography>
                                <div>
                               
                                    <label className="block text-gray-700 font-medium mb-2">Resturant name</label>
                                    <Input
                                        size="lg"
                                        label="Restaurant Name"
                                        name="name"
                                        value={cuisinedata.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* description */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={cuisinedata.description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
                                    ></textarea>
                                </div>


 {/* cuisines */}
 <div className="space-y-4">
                                    <Typography variant="h6" className=" text-gray-700 font-medium mb-4">Cuisines</Typography>
                                    {cuisines.map((item, index) => (
                                        <div key={index} className="space-y-4 ">
                                            <Input
                                                size="sm"
                                                label="Cuisine Name"
                                                value={item.cuisinename}
                                                onChange={(e) =>
                                                    handleDynamicChange(
                                                        index,
                                                        "cuisinename",
                                                        e.target.value,
                                                        setcuisines,
                                                        cuisines,

                                                    )
                                                }
                                            />
                                           
                                            <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-100 focus:outline-none">

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        handleDynamicChange(
                                                            index,
                                                            "cuisineimageurl",
                                                            e.target.files[0],
                                                            setcuisines,
                                                            cuisines,

                                                        )
                                                    }
                                                    className="hidden"
                                                />

                                                <span className="text-gray-700">Upload Image (1000 x 500 px)</span>
                                            </label>
                                             {/* Image Preview */}
                                             {item.cuisineimageurl && item.cuisineimageurl instanceof File && (
                                                    <div className="w-80 mb-4">
                                                        <img
                                                            src={URL.createObjectURL(item.cuisineimageurl)}
                                                            alt={item.alt || `Restaurant image ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}

                                            <div className="flex gap-5">
                                                <Input
                                                    size="sm"
                                                    label="Alt"
                                                    value={item.cuisinealt}
                                                    onChange={(e) =>
                                                        handleDynamicChange(
                                                            index,
                                                            "cuisinealt",
                                                            e.target.value,
                                                            setcuisines,
                                                            cuisines,
                                                        )
                                                    }
                                                />

                                                <div className="flex gap-3 mt-2">
                                                    <RiChatDeleteFill
                                                        onClick={() => removeField(
                                                            index,
                                                            setcuisines,
                                                            cuisines,
                                                        )}
                                                        color="red"
                                                        style={{ fontSize: '20px', cursor: 'pointer' }}
                                                    />
                                                    <BiSolidMessageAdd
                                                        onClick={() =>
                                                            addField(setcuisines, {
                                                                cuisinename: "",
                                                                cuisineimageurl: "",
                                                                cuisinealt: "",
                                                                cuisinecaption: "",
                                                            })}
                                                        
                                                        style={{ fontSize: '20px', cursor: 'pointer' }}
                                                    />
                                                </div>
                                            </div>
                                            <hr className="border-b-2 border-gray-700" />
                                           
                                        </div>
                                    ))}
                                </div>
                                

                                {/* Restaurant Images */}
                                <div className="space-y-4">
                                    <Typography variant="h6" className=" text-gray-700 font-medium mb-4">Restaurant Images</Typography>
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
                                                                "resturantimage",
                                                                e.target.files[0],
                                                                setgallery,
                                                                gallery
                                                            )
                                                        }
                                                        className="hidden"
                                                    />

                                                    <span className="text-gray-700">Upload Image (1000 x 500 px)</span>
                                                </label>

                                                {/* Image Preview */}
                                                {item.resturantimage && item.resturantimage instanceof File && (
                                                    <div className="w-80 mb-4">
                                                        <img
                                                            src={URL.createObjectURL(item.resturantimage)}
                                                            alt={item.alt || `Restaurant image ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}

<div className="flex gap-5">
                                                    {/* Alt Text Input */}
                                                    <Input
                                                        size="sm"
                                                        label="Alt"
                                                        value={item.alt}
                                                        onChange={(e) =>
                                                            handleDynamicChange(
                                                                index,
                                                                "alt",
                                                                e.target.value,
                                                                setgallery,
                                                                gallery
                                                            )
                                                        }
                                                    />
                                                    <div className="flex gap-3 mt-2">
                                                        {/* Add and Remove Buttons */}
                                                        <RiChatDeleteFill
                                                            onClick={() => removeField(index, setgallery, gallery)}
                                                            color="red"
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                        />
                                                        <BiSolidMessageAdd
                                                            onClick={() =>
                                                                addField(
                                                                    setgallery, {
                                                                    resturantimage: "",
                                                                    alt: "",
                                                                    caption: "",
                                                                })}
                                                            
                                                            style={{fontSize:'20px',  cursor: 'pointer' }}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                            <hr className="border-b-2 border-gray-700" />
                                        </div>
                                    ))}
                                    
                                </div>


                               

                                 {/* cities */}
                                 <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-2">Select City</label>
                                    <select
                                        name="cityid"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a City
                                        </option>
                                        {cities.map((city, index) => (
                                            <option key={index} value={city._id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                 {/* hotels */}
                                 <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-2">Select Hotel</label>
                                    <select
                                        name="hotelid"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
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
                               
                                    <label className="block text-gray-700 font-medium mb-2">Resturant direction link</label>
                                    <Input
                                        size="lg"
                                        label="Restaurant direction link"
                                        name="getdirection"
                                        value={cuisinedata.getdirection}
                                        onChange={handleChange}
                                        required
                                    />
                                    {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
                                </div>


                            </div>

                            {/* Arabic form */}
                            <div className="space-y-4 gird grid-cols-1 gap-4">
                            <Typography variant="h6" className=" text-gray-700 font-medium mb-4">
        تفاصيل باللغة العربية
    </Typography>
    <div>
        <label className="block text-gray-700 font-medium mb-2">اسم المطعم</label>
        <Input
            size="lg"
            label="اسم المطعم"
            name="arabicname"
            value={cuisinedata.arabicname}
            onChange={handleChange}
            required
        />
    </div>

                                {/* resturant description */}
                                <div>
        <label className="block text-gray-700 font-medium mb-2">الوصف</label>
        <textarea
            name="arabicdescription"
            value={cuisinedata.arabicdescription}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300"
        ></textarea>
    </div>

                            

                                {/* cuisines */}
                                {/* cuisines */}
                                <div className="space-y-4">
        <Typography variant="h6" className=" text-gray-700 font-medium mb-4">المأكولات</Typography>
        {cuisines.map((item, index) => (
            <div key={index} className="space-y-4">
                <Input
                    size="sm"
                    label="اسم المأكولات"
                    name="arabiccuisinename"
                    value={item.arabiccuisinename}
                    onChange={(e) =>
                        handleDynamicChange(
                            index,
                            "arabiccuisinename",
                            e.target.value,
                            setcuisines,
                            cuisines,
                        )
                    }
                />
            </div>
        ))}
    </div>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div className="p-5">
                            <Button type="submit" className="w-40 bg-gray-900" color="black" fullWidth>
                                ADD RESTURANT
                            </Button>
                        </div>
                    </form>
                {/* </Card> */}
            </div>
        </div>
    )
}

