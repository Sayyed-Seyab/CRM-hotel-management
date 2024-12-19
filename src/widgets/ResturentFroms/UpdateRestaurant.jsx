import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Textarea, Typography, Input } from '@material-tailwind/react';
import { RiChatDeleteFill } from "react-icons/ri";
import { BiSolidMessageAdd } from "react-icons/bi";
import axios from 'axios';
import { StoreContext } from '@/context/context';
import { useNavigate } from 'react-router-dom';

export default function UpdateRestaurant() {
    const { url, agentid, SetTostMsg, hotels, Editrestaurant, cities } = useContext(StoreContext);
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

    useEffect(() => {
        if (Editrestaurant) {
           
            setcuisinedata({
                agentid: Editrestaurant[0].agentid || agentid,
                hotelid: Editrestaurant[0].hotelid || "",
                cityid: Editrestaurant[0].cityid || "",
                name: Editrestaurant[0].name?.split(" | ")[0] || "",
                arabicname: Editrestaurant[0].name?.split(" | ")[1] || "",
                arabicdescription: Editrestaurant[0].description?.split(" | ")[1] || "",
                description: Editrestaurant[0].description?.split(" | ")[0] || "",
                getdirection: Editrestaurant[0].getdirection || "",
                restaurantimage: Editrestaurant[0].resturantimage || gallery,
                dining: Editrestaurant[0].dining?.map((item) => ({
                    heading: item.heading?.split(" | ")[0] || "",
                    arabicheading: item.heading?.split(" | ")[1] || "",
                    arabicdesc: item.desc?.split(" | ")[1] || "",
                    desc: item.desc?.split(" | ")[0] || "",
                   
                })) || diningdata,
                cuisines: Editrestaurant[0].cuisines?.map((item) => ({
                    cuisinename: item.cuisinename?.split(" | ")[0] || "",
                    arabiccuisinename: item.cuisinename?.split(" | ")[1] || "",
                    cuisineimageurl: item.cuisineimage.url || "",
                    cuisinealt: item.cuisineimage.alt || "",
                    cuisinecaption: item.cuisineimage.cuisinecaption || "",
                })) || cuisines,
            });
    
            // Update gallery with formatted multilingual fields
            // setgallery(
            //     Editrestaurant[0].image?.map((item) => ({
            //         resturantimage: item.resturantimage.url || "",
            //         alt: item.resturantimage.alt|| "",
            //         caption: item.resturantimage.caption|| "",
            //     })) || gallery
            // );
    
            // Update dining data
            setdiningdata(
                Editrestaurant[0].dining?.map((item) => ({
                    heading: item.heading?.split(" | ")[0] || "",
                    arabicheading: item.heading?.split(" | ")[1] || "",
                    arabicdesc: item.desc?.split(" | ")[1] || "",
                    desc: item.desc?.split(" | ")[0] || "",
                    diningimageurl: item.diningimage.url || "",
                    diningalt: item.diningimage.alt || "",
                    diningcaption: item.diningcaption || "",
                    backgroundurl: item.backgroundimage.url || "",
                    backgroundalt: item.backgroundimage.alt || "",
                    backgroundcaption: item.backgroundcaption || "",
                })) || diningdata
            );
    
            // Update cuisines data
            // setcuisines(
            //     Editrestaurant[0].cuisines?.map((item) => ({
            //         cuisinename: item.cuisinename?.split(" | ")[0] || "",
            //         arabiccuisinename: item.cuisinename?.split(" | ")[1] || "",
            //         cuisineimageurl: item.cuisineimage.url || "",
            //         cuisinealt: item.cuisineimage.alt || "",
            //         cuisinecaption: item.cuisineimage.caption || "",
            //     })) || cuisines
            // );
        }
    }, [Editrestaurant]);
    


    const [urlError,setUrlError ] = useState('')
    const handleDynamicChange = (index, field, value, setter, state) => {
        const updated = [...state];
    
    // Handle file input separately for clarity
    if (field === "resturantimage" || field === "cuisineimageurl") {
        updated[index][field] = value instanceof File ? value : "";
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
    
        const formdata = new FormData();
    
        // Append top-level fields
        formdata.append("agentid", cuisinedata.agentid);
        formdata.append("cityid", cuisinedata.cityid);
        formdata.append("hotelid", cuisinedata.hotelid);
        formdata.append("name", `${cuisinedata.name} | ${cuisinedata.arabicname}`);
        formdata.append("description", `${cuisinedata.description} | ${cuisinedata.arabicdescription}`);
        formdata.append("getdirection", cuisinedata.getdirection);
    
        // Append nested fields for restaurant images
        gallery.forEach((item, index) => {
            formdata.append('resturantimage', item.resturantimage);
            formdata.append(`resturantimagealt_${index}`, item.alt);
            formdata.append(`resturantimagecaption_${index}`, item.caption);
            console.log(item.gallery)
        });
    
      
    
        // Append nested fields for cuisines
       cuisines.forEach((item, index) => {
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
            const response = await axios.put(
                `${url}/api/admin/updateresturant/${Editrestaurant[0]._id}`,
                formdata,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/restaurants');
               
            } else {
                alert(response.data.message);
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
         console.log(Editrestaurant)
    

    }, [cuisines, diningdata, gallery, cuisinedata])

    return (
        <div>
            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
                <Card className="w-full">
                    <Typography variant="h2" className="font-bold text-center mb-4">
                       Update Restaurant
                    </Typography>
                    {/* form */}
                    <form onSubmit={handleSubmit} className="space-y-6 max-h-[600px] overflow-y-auto">
                        <div className="pl-5 pr-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4 grid-cols-1  gap-4">
                                <Typography variant="h4" className="font-medium mb-4">
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


                                {/* Cuisines */}
<div className="space-y-4">
    <Typography variant="h6" className="font-medium mb-4">Update Cuisines</Typography>
    {cuisines.map((item, index) => (
        <div key={index} className="space-y-4">
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
            <Typography variant="h6" className="font-medium">Cuisine Image</Typography>
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
                <span className="text-gray-700">Choose files</span>
            </label>
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
                        onClick={() => removeField(index, setcuisines, cuisines)}
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
                            })
                        }
                        
                        style={{ fontSize: '20px', cursor: 'pointer' }}
                    />
                </div>
            </div>

            {/* Image Preview */}
            <div className="w-80 mb-4">
                {item.cuisineimageurl && item.cuisineimageurl instanceof File ? (
                    <img
                        src={URL.createObjectURL(item.cuisineimageurl)}
                        alt={item.cuisinealt || `Cuisine image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                    />
                ) : item.cuisineimageurl ? (
                    <div></div>
                    // <img
                    //     src={`${url}/Images/${item.cuisineimageurl}`}
                    //     alt={item.cuisinealt || `Cuisine image ${index + 1}`}
                    //     className="w-full h-32 object-cover rounded-lg"
                    // />
                ) : null}
            </div>
            <hr className="border-b-2 border-gray-700" />
        </div>
        
    ))}


</div>



    


                               {/* Restaurant Images */}
<div className="space-y-4">
    <Typography variant="h6" className="font-medium mb-4">Update Restaurant </Typography>
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
                    <span className="text-gray-700">Choose files</span>
                </label>

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
                                addField(setgallery, {
                                    resturantimage: "",
                                    alt: "",
                                    caption: "",
                                })
                            }
                            
                            style={{ fontSize: '20px', cursor: 'pointer' }}
                        />
                    </div>
                </div>

                {/* Image Preview */}
                <div className="w-80 mb-4">
                    {item.resturantimage && item.resturantimage instanceof File ? (
                        <img
                            src={URL.createObjectURL(item.resturantimage)}
                            alt={item.alt || `Restaurant image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                    ) : item.resturantimage ? (
                        <div>

                        </div>
                        // <img
                        //     src={`${url}/Images/${item.resturantimage}`}
                        //     alt={item.alt || `Restaurant image ${index + 1}`}
                        //     className="w-full h-32 object-cover rounded-lg"
                        // />
                    ) : null}
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
                            <Typography variant="h4" className="font-medium mb-4">
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
        <Typography variant="h6" className="font-medium mb-4">المأكولات</Typography>
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
                </Card>
            </div>
        </div>
    )
}

