import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/context/context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RiChatDeleteFill } from "react-icons/ri";
import { BiSolidMessageAdd } from "react-icons/bi";
import { Input, Typography } from "@material-tailwind/react";
import Select from "react-select"; // Import react-select for searchable dropdown

const AddTravelAgent = () => {
    const { fetchCities, fetchHotels, fetchTravelAgent, cities, hotels, SetTostMsg, url, agentid, password, TravelAgent } = useContext(StoreContext);
    const navigate = useNavigate();
   
    const [formData, setFormData] = useState({
        agentid: agentid,
        userid: "",
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
        accountstatus: "",
        accesslevel: "",
        addedby: agentid,
        cities: [{ id: "", discount: 0 }],
        hotels: [{ id: "", discount: 0 }],
        minamount: 0,
        discount: 0,
        maxrooms: 0,
        maxnights: 0,
    });
    const [agents, setAgents] = useState([])
    useEffect(() => {
        if (Array.isArray(TravelAgent) && TravelAgent.length > 0) {
            const filteragents = TravelAgent.filter((agnt) => agnt.user.role == 'user');
            const agents = filteragents.map((agent) => ({
                value: agent.user._id,
                label: agent.user.email,
            }));

            setAgents(agents);
        }
        // console.log(agents)
    }, [TravelAgent,]);

    const handleAgentSelect = (selectedOption) => {
        setFormData({ ...formData, userid: selectedOption ? selectedOption.value : "" });
    };

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
        Formdata.append("addedby", formData.agentid);
        Formdata.append("name", formData.name);
        Formdata.append("email", formData.email);
        Formdata.append("phone", formData.phone);
        Formdata.append("address", formData.address);
        Formdata.append("city", formData.city);
        Formdata.append("country", formData.country);
        Formdata.append("govtid", formData.govtid);
        Formdata.append("configpassword", formData.configpassword);
        Formdata.append("password", formData.password);
        Formdata.append("role", formData.role);
        Formdata.append("minamount", formData.minamount);
        Formdata.append("maxnights", formData.maxnights);
        Formdata.append("maxrooms", formData.maxrooms);
        Formdata.append("discount", formData.discount);


        // JSON stringify cities with their discounts
        const citiesJson = JSON.stringify(formData.cities);
        Formdata.append("cities", citiesJson);

        // JSON stringify hotels with their discounts
        const hotelsJson = JSON.stringify(formData.hotels);
        Formdata.append("hotels", hotelsJson);

        // Submit the form data
        try {
            const response = await axios.put(
                `${url}/api/admin/updatetravelagent/${formData.userid}`,
                Formdata,
                { headers: { "Content-Type": "multipart/form-data", agentid, password } }
            );
            console.log(response)
            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate('/dashboard/travel-agents')
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding travel agent:", error);
            alert("Error adding room");
        }
    };




    useEffect(() => {
        fetchTravelAgent()
        fetchCities();
        fetchHotels();
        console.log(formData)
        console.log(TravelAgent)
        console.log(cities)
    }, [formData]);




    return (
        <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
            <Typography variant="h2" className="font-bold block text-gray-700  text-center mb-2">
                Add Travel Agent
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Select User</label>
                    <Select
                        options={agents}
                        value={agents.find((agent) => agent.value === formData.userid) || null}
                        onChange={handleAgentSelect}
                        isSearchable={true}
                        placeholder="Search and select user"
                        noOptionsMessage={() => "No agents available"}
                    />
                </div>
                {/* Basic Fields */}
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
                                        <option className="text-gray-700" value="Select City" >
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
                                        className="w-20  border border-gray-300 rounded-lg px-4 py-2"
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
                                        <option value="Select Hotel" >
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
                </div>






                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-gray-900 text-white font-medium py-2 px-4 rounded-lg w-40"
                >
                    ADD AGENT
                </button>
            </form>
        </div>
    );
};

export default AddTravelAgent;
