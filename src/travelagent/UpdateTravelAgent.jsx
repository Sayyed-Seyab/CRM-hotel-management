import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/context/context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RiChatDeleteFill } from "react-icons/ri";
import { BiSolidMessageAdd } from "react-icons/bi";
import { Typography, Input, } from "@material-tailwind/react";


const UpdateTravelAgent = () => {
    const {EditTravelAgent, fetchCities, fetchHotels, cities, hotels, SetTostMsg, url, agentid, password, TravelAgent,  SetEditTravelAgent } = useContext(StoreContext);
    const navigate = useNavigate();
    console.log(EditTravelAgent);

    const [formData, setFormData] = useState({
        agentid: agentid,
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        govtid: "",
        password: "",
        configpassword: "",
        role: "travelagent",
        accountstatus: "active",
        accesslevel: "",
        lasteditby: agentid,
        cities: [{ id: "", discount: 0 }],
        hotels: [{ id: "", discount: 0 }],
        minamount: 0,
        discount: 0,
        maxrooms: 0,
        maxnights: 0,
        
    });
   

    // Populating the form with the agent's initial data
    useEffect(() => {
        if (EditTravelAgent) {
            // Check if travelagent is an array and access the first element (or handle accordingly)
            const travelAgentData = Array.isArray(EditTravelAgent.travelagent)
                ? EditTravelAgent.travelagent[0] // Adjust index based on your logic
                : EditTravelAgent.travelagent;
        
            setFormData((prevFormData) => {
                const updatedFormData = {
                    ...prevFormData, // Keep existing formData values in object 
        
                    // Update fields that need to be set
                    name: EditTravelAgent.user.name || "",
                    email: EditTravelAgent.user.email || "",
                    phone: EditTravelAgent.user.phone || "",
                    address: EditTravelAgent.user.address || "",
                    city: EditTravelAgent.user.city || "",
                    country: EditTravelAgent.user.country || "",
                    govtid: EditTravelAgent.user.govtid || "",
                    role: EditTravelAgent.user.role || "travelagent",
                    accountstatus: EditTravelAgent.user.accountstatus || "active",
                    minamount: travelAgentData.minamount || 0,
                    discount: travelAgentData.discount || 0,
                    maxrooms: travelAgentData.maxrooms || 0,
                    maxnights: travelAgentData.maxnights || 0,
                };
        
                // If user role is not 'user', update object and add cities and hotels
                if (EditTravelAgent.user.role !== "user") {
                
                    updatedFormData.cities = travelAgentData && travelAgentData.cities.length > 0
                        ? travelAgentData.cities.map((city) => ({
                            id: city.city.cityid || "",
                            discount: city.city.discount || 0,
                        }))
                        : [{ id: "", discount: 0 }];
                        
                    updatedFormData.hotels = travelAgentData && travelAgentData.hotels.length > 0
                        ? travelAgentData.hotels.map((hotel) => ({
                            id: hotel.hotel.hotelid || "",
                            discount: hotel.hotel.discount || 0,
                        }))
                        : [{ id: "", discount: 0 }];
                } else {
                    // Set empty default values for cities and hotels if role is 'user'
                    updatedFormData.cities = [{ id: "", discount: 0 }];
                    updatedFormData.hotels = [{ id: "", discount: 0 }];
                }
        
                return updatedFormData; // Return updated formData object
            });
        }
        

        
        
    }, [EditTravelAgent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDynamicChange = (field, index, key, value) => {
        const updated = [...formData[field]];
        updated[index][key] = value;
        setFormData((prev) => ({ ...prev, [field]: updated }));
    };

    const addField = (field, defaultValue) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], defaultValue] }));
    };

    const removeField = (field, index) => {
        // if (index > 0) {
            const updated = formData[field].filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, [field]: updated }));
        // }
    };

    const validatePasswords = () => formData.password === formData.configpassword;

   
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that passwords match
        if (!validatePasswords()) {
            return toast.error("Passwords do not match!");
        }

        // Create FormData object to send with the request
        const Formdata = new FormData();

        // Append basic form fields configpassword
        Formdata.append("agentid", formData.agentid);
        Formdata.append("lasteditby", formData.lasteditby);
        Formdata.append("name", formData.name);
        Formdata.append("email", formData.email);
        Formdata.append("phone", formData.phone);
        Formdata.append("address", formData.address);
        Formdata.append("city", formData.city);
        Formdata.append("country", formData.country);
        Formdata.append("govtid", formData.govtid);
        Formdata.append("minamount", formData.minamount);
        Formdata.append("maxnights", formData.maxnights);
        Formdata.append("maxrooms", formData.maxrooms);
        Formdata.append("discount", formData.discount);
        Formdata.append("role", formData.role);
        // Formdata.append("addedby", formData.addedby);

        // JSON stringify cities with their discounts
        const citiesJson = JSON.stringify(formData.cities);
        Formdata.append("cities", citiesJson);

        // JSON stringify hotels with their discounts
        const hotelsJson = JSON.stringify(formData.hotels);
        Formdata.append("hotels", hotelsJson);
// Log the FormData values to the console
for (let [key, value] of Formdata.entries()) {
    console.log(`${key}: ${value}`);
}
        // Submit the form data
        try {
            const response = await axios.put(
                `${url}/api/admin/updatetravelagent/${EditTravelAgent.user._id}`,
                Formdata,
                { headers: { "Content-Type": "multipart/form-data", agentid, password } }
            );
            console.log(response);
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate("/dashboard/travel-agents");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating travel agent:", error);
            alert("Error updating agent");
        }
    };

    useEffect(() => {
        fetchCities();
        fetchHotels();
        console.log(formData);
    }, [formData]);

    return (
        <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
            <Typography variant="h2" className="font-bold block text-gray-700 text-center mb-2">
              {EditTravelAgent.user.role =="user"? "Add Uxser to Travel Agent": " Add Travel Agent"} 
            </Typography>
            <div className="mb-5 w-100 gap-4 bg-gray-100 p-6 rounded-lg shadow-md">
  <div className="flex justify-between items-center">
    <Typography variant="h6" className="font-semibold text-gray-700">
      Name:
    </Typography>
    <Typography variant="body1" className="text-gray-900">
      {EditTravelAgent.user.name}
    </Typography>
  </div>

  <div className="flex justify-between items-center">
    <Typography variant="h6" className="font-semibold text-gray-700">
      Email:
    </Typography>
    <Typography variant="body1" className="text-gray-900">
      {EditTravelAgent.user.email}
    </Typography>
  </div>

  <div className="flex justify-between items-center">
    <Typography variant="h6" className="font-semibold text-gray-700">
      Status:
    </Typography>
    <Typography
  variant="body1"
  className={`font-medium ${
    ["approved", "activate"].includes(EditTravelAgent.user.accountstatus.toLowerCase())
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {EditTravelAgent.user.accountstatus === 'unapproved'?EditTravelAgent.user.accountstatus + "(Email not verify)": EditTravelAgent.user.accountstatus }
</Typography>
  </div>

  <div className="flex justify-between items-center">
    <Typography variant="h6" className="font-semibold text-gray-700">
      Minimum Amount:
    </Typography>
    <Typography variant="body1" className="text-gray-900">
      {EditTravelAgent.travelagent.minamount?EditTravelAgent.travelagent.minamount:"0"}
    </Typography>
  </div>

  <div className="flex justify-between items-center">
    <Typography variant="h6" className="font-semibold text-gray-700">
      Amount Used:
    </Typography>
    <Typography variant="body1" className="text-gray-900">
      {EditTravelAgent.travelagent.amountused?EditTravelAgent.travelagent.amountused:"0"}
    </Typography>
  </div>

  <div className="flex justify-between items-center">
    <Typography variant="h6" className="font-semibold text-gray-700">
      Total Amount:
    </Typography>
    <Typography variant="body1" className="text-gray-900">
      {EditTravelAgent.travelagent.totalamount?EditTravelAgent.travelagent.totalamount:"0"}
    </Typography>
  </div>
</div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {/* Dynamic Cities */}
            <div>
                {formData.cities.map((city, index) => (
                    <div key={index} className="flex gap-4 mb-3">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Cities</label>
                            <select
                                value={city.id}
                                onChange={(e) => handleDynamicChange("cities", index, "id", e.target.value)}
                                className="w-60 text-gray-700 border border-gray-300 rounded-lg px-4 py-2"
                               
                            >
                                <option className="text-gray-700" value="" >
                                    Select City
                                </option>
                                {cities.map((cityOption, idx) => (
                                    <option key={idx} value={cityOption._id}>
                                        {cityOption.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Discount</label>
                            <input
                                type="number"
                                value={city.discount}
                                onChange={(e) => handleDynamicChange("cities", index, "discount", e.target.value)}
                                placeholder="Discount"
                                className="w-20 border border-gray-300 rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="flex gap-2 mt-7">
                            <RiChatDeleteFill
                                type="button"
                                onClick={() => removeField("cities", index)}
                                style={{ fontSize: '15px', cursor: 'pointer', color: 'red' }}
                            />
                            <BiSolidMessageAdd
                                type="button"
                                onClick={() => addField("cities", { id: "", discount: 0 })}
                                style={{ fontSize: '15px', cursor: 'pointer', color: 'black' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Dynamic Hotels */}
            <div>
                {formData.hotels.map((hotel, index) => (
                    <div key={index} className="flex gap-4 mb-3">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Hotels</label>
                            <select
                                value={hotel.id}
                                onChange={(e) => handleDynamicChange("hotels", index, "id", e.target.value)}
                                className="w-60 border text-gray-700 border-gray-300 rounded-lg px-4 py-2"
                               
                            >
                                <option value="" >
                                    Select Hotel
                                </option>
                                {hotels.map((hotelOption, idx) => (
                                    <option key={idx} value={hotelOption._id}>
                                        {hotelOption.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Discount</label>
                            <input
                                type="number"
                                value={hotel.discount}
                                onChange={(e) => handleDynamicChange("hotels", index, "discount", e.target.value)}
                                placeholder="Discount"
                                className="w-20 border border-gray-300 rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="flex gap-2 mt-7">
                            <RiChatDeleteFill
                                type="button"
                                onClick={() => removeField("hotels", index)}
                                style={{ fontSize: '15px', cursor: 'pointer', color: 'red' }}
                            />
                            <BiSolidMessageAdd
                                type="button"
                                onClick={() => addField("hotels", { id: "", discount: 0 })}
                                style={{ fontSize: '15px', cursor: 'pointer', color: 'black' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

             <div>
              <label className="block text-gray-700 font-medium mb-2">Minimum Amount</label>
              <Input
                size="lg"
                label="Minimum Amount"
                name="minamount"
                type="number"
                value={formData.minamount}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Discount</label>
              <Input
                size="lg"
                label="Discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Max Rooms</label>
              <Input
                size="lg"
                label="Max Rooms"
                name="maxrooms"
                type="number"
                value={formData.maxrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Max Nights</label>
              <Input
                size="lg"
                label="Max Nights"
                name="maxnights"
                type="number"
                value={formData.maxnights}
                onChange={handleChange}
                required
              />
            </div>










                {/* Other Form Fields */}
                {/* <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}
                {/* <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}
                {/* <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}
                {/* <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}
                {/* <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}
                {/* <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}

                {/* Password Fields */}
                {/* <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                />
                <input
                    type="password"
                    name="configpassword"
                    placeholder="Confirm Password"
                    value={formData.configpassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}


                {/* {formData.password && formData.configpassword && formData.password !== formData.configpassword && (
                    <div className="text-red-500 text-sm mt-2">
                        Password and confirm password must be the same
                    </div>
                )} */}

                {/* Government ID */}
                {/* <input
                    type="text"
                    name="govtid"
                    placeholder="Government ID"
                    value={formData.govtid}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                /> */}
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-gray-900 text-white font-medium py-2 px-4 rounded-lg w-40"
                >
                    UPDATE AGENT
                </button>
                
            </form>
        </div>
    );
};

export default UpdateTravelAgent;
