import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Textarea, Typography, Input } from '@material-tailwind/react';
import { RiChatDeleteFill } from "react-icons/ri";

import axios from 'axios';
import { StoreContext } from '@/context/context';
import { useNavigate } from 'react-router-dom';
import { BiSolidMessageAdd } from "react-icons/bi";

export default function UpdateLoyalty() {
    const { url, agentid, SetTostMsg, Editloyalty } = useContext(StoreContext);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const [otherFacilities, setOtherFacilities] = useState([{ point: "", arabicpoints: "" }]);
    const [loyaltyPlanData, setLoyaltyPlanData] = useState({
        agentid: agentid,
        plantype: "",
        loyaltyplanimage: "",
        alt: "",
        colorcode: "",
        minstay: "",
        maxstay: "",
        signup: "",
        signupdiscountpercent: "",
        signupbonus: "",
        valueearned: "",
        valueredeemed: "",
        minimumpointstoredeem: "",
        otherfacilities: otherFacilities,
    });

    // Populate data if editing
    useEffect(() => {
        if (Editloyalty) {
            const facilities = Editloyalty[0]?.otherfacilities?.map((item) => ({
                point: item.point?.split("|")[0] || "",
                arabicpoints: item.point?.split("|")[1] || "",
            })) || [{ point: "", arabicpoints: "" }];

            setLoyaltyPlanData({
                agentid: Editloyalty[0].agentid || agentid,
                plantype: Editloyalty[0].plantype || "",
                loyaltyplanimage: Editloyalty[0].loyaltyplanimage || "",
                alt: Editloyalty[0].alt || "",
                colorcode: Editloyalty[0].colorcode || "",
                minstay: Editloyalty[0].minstay || "",
                maxstay: Editloyalty[0].maxstay || "",
                signup: Editloyalty[0].signup || "",
                signupdiscountpercent: Editloyalty[0].signupdiscountpercent || "",
                signupbonus: Editloyalty[0].signupbonus || "",
                valueearned: Editloyalty[0].valueearned || "",
                valueredeemed: Editloyalty[0].valueredeemed || "",
                minimumpointstoredeem: Editloyalty[0].minimumpointstoredeem || "",
                otherfacilities: facilities,
            });

            setOtherFacilities(facilities);
        }
    }, [Editloyalty, agentid]);

    const handleDynamicChange = (index, field, value) => {
        const updated = [...otherFacilities];
        updated[index][field] = value;
        setOtherFacilities(updated);

        // Update main data state
        setLoyaltyPlanData((prev) => ({
            ...prev,
            otherfacilities: updated,
        }));
    };

    const addField = () => {
        setOtherFacilities((prev) => [...prev, { point: "", arabicpoints: "" }]);
    };

    const removeField = (index) => {
        if (otherFacilities.length > 1) {
            const updated = otherFacilities.filter((_, i) => i !== index);
            setOtherFacilities(updated);
            setLoyaltyPlanData((prev) => ({
                ...prev,
                otherfacilities: updated,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoyaltyPlanData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setLoyaltyPlanData((prev) => ({
            ...prev,
            loyaltyplanimage: e.target.files[0],
        }));
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('agentid', loyaltyPlanData.agentid);
        formdata.append('plantype', loyaltyPlanData.plantype);
        formdata.append('LoyaltyPlanImage', loyaltyPlanData.loyaltyplanimage);
        formdata.append('alt', loyaltyPlanData.alt);
        formdata.append('colorcode', loyaltyPlanData.colorcode);
        formdata.append('minstay', loyaltyPlanData.minstay);
        formdata.append('maxstay', loyaltyPlanData.maxstay);
        formdata.append('signup', Boolean(loyaltyPlanData.signup));
        formdata.append('signupdiscountpercent', loyaltyPlanData.signupdiscountpercent);
        formdata.append('signupbonus', loyaltyPlanData.signupbonus);
        formdata.append('valueearned', loyaltyPlanData.valueearned);
        formdata.append('valueredeemed', loyaltyPlanData.valueredeemed);
        formdata.append('minimumpointstoredeem', loyaltyPlanData.minimumpointstoredeem);

        // Join English and Arabic points for each facility
        const formattedFacilities = loyaltyPlanData.otherfacilities.map((facility) => ({
            point: `${facility.point} | ${facility.arabicpoints}`, // Combine English and Arabic
        }));

        // Log FormData keys and values
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }


        // Add otherFacilities as JSON string
        formdata.append('otherfacilities', JSON.stringify(formattedFacilities));
        try {
            const response = await axios.put(`${url}/api/admin/loyaltyplan/${Editloyalty[0]._id}`, formdata, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                SetTostMsg(response.data.message);
                navigate("/dashboard/loyalty");
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error adding loyalty plan:", error);
            alert("Error adding loyalty plan");
        }
    };

    useEffect(() => {
        console.log(loyaltyPlanData)
    }, [loyaltyPlanData])
    return (
        <div>
            <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
                <Typography
                    variant="h2"
                    className="font-bold text-gray-700 text-center mb-4"
                >
                    Update Loyalty Plan
                </Typography>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-h-[600px] overflow-y-auto"
                >
                    <div className="pl-5 pr-5 grid grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Basic Details */}
                        <div className="space-y-4 grid-cols-1 gap-4">
                            <Typography variant="h6" className="text-gray-700 font-medium mb-4">
                                Basic Details
                            </Typography>

                            {/* Other Facilities */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Other Facilities
                                </label>
                                {otherFacilities.map((facility, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <textarea
                                            rows="2"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300 mb-4"
                                            placeholder={`Facility ${index + 1}`}
                                            value={facility.point}
                                            onChange={(e) =>
                                                handleDynamicChange(
                                                    index,
                                                    "point",
                                                    e.target.value,
                                                    setOtherFacilities,
                                                    otherFacilities
                                                )
                                            }
                                        ></textarea>
                                        <RiChatDeleteFill
                                            onClick={() =>
                                                removeField(index, setOtherFacilities, otherFacilities)
                                            }
                                            color="red"
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                        />
                                        <BiSolidMessageAdd
                                            onClick={() =>
                                                addField(setOtherFacilities, { point: "", arabicpoints: "" })
                                            }
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Plan Type */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Plan Type
                                </label>
                                <select
                                    name="plantype"
                                    value={loyaltyPlanData.plantype || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                    required
                                >
                                    <option value="" disabled>
                                        Select a Plan Type
                                    </option>
                                    <option value="Silver">Silver</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Platinum">Platinum</option>
                                </select>
                            </div>

                            {/* Loyalty Image */}
                            <div className="space-y-2">
                                <Typography variant="small" className="font-medium">
                                    Loyalty Image
                                </Typography>
                                <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <span className="text-gray-700">Upload Image (1000 x 500 px)</span>
                                </label>
                                <Input
                                    size="lg"
                                    label="alt"
                                    name="alt"
                                    value={loyaltyPlanData.alt}
                                    onChange={handleChange}
                                />
                                {/* Image Preview */}
                                <div className="w-20 mb-4">
                                    {loyaltyPlanData.loyaltyplanimage && loyaltyPlanData.loyaltyplanimage instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(loyaltyPlanData.loyaltyplanimage)}
                                            alt={loyaltyPlanData.alt || "Loyalty Image Preview"}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                    ) : loyaltyPlanData.loyaltyplanimage ? (
                                        <img
                                            src={`${url}/Images/${loyaltyPlanData.loyaltyplanimage}`}
                                            alt={loyaltyPlanData.alt || "Loyalty Image"}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                    ) : null}
                                </div>

                            </div>

                            {/* Color Code */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Color Code
                                </label>
                                <Input
                                    size="lg"
                                    label="Color Code"
                                    name="colorcode"
                                    value={loyaltyPlanData.colorcode}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Minimum Stay */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Minimum Stay
                                </label>
                                <Input
                                    size="lg"
                                    type="number"
                                    label="Minimum Stay"
                                    name="minstay"
                                    value={loyaltyPlanData.minstay}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Maximum Stay */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Maximum Stay
                                </label>
                                <Input
                                    size="lg"
                                    type="number"
                                    label="Maximum Stay"
                                    name="maxstay"
                                    value={loyaltyPlanData.maxstay}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Signup Bonus */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Signup Bonus Eligibility
                                </label>
                                <select
                                    name="signup"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                                >
                                    {loyaltyPlanData.signup ? (
                                        <option disabled value={loyaltyPlanData.signup}>
                                            {loyaltyPlanData.signup = "true" ? "Yess" : "NO"}
                                        </option>
                                    ) : null}
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>

                            {/* Signup Discount */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Signup Discount (%)
                                </label>
                                <Input
                                    size="lg"
                                    type="number"
                                    label="Signup Discount"
                                    name="signupdiscountpercent"
                                    value={loyaltyPlanData.signupdiscountpercent}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Points Section */}
                            <div>
                                <Typography variant="h6" className="text-gray-700 font-medium mb-4">
                                    Points and Facilities
                                </Typography>

                                {/* Signup Bonus Points */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Signup Bonus Points
                                    </label>
                                    <Input
                                        size="lg"
                                        type="number"
                                        label="Signup Bonus"
                                        name="signupbonus"
                                        value={loyaltyPlanData.signupbonus}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Value Earned */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Value Earned per SAR
                                    </label>
                                    <Input
                                        size="lg"
                                        type="number"
                                        label="Value Earned"
                                        name="valueearned"
                                        value={loyaltyPlanData.valueearned}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Arabic Details */}
                        <div className="cols-1">
    <Typography variant="h6" className="text-gray-700 font-medium mb-4">
        تفاصيل باللغة العربية
    </Typography>

    {/* المرافق الأخرى */}
    <div>
        <label className="block text-gray-700 font-medium mb-2">
            المرافق الأخرى
        </label>
        {otherFacilities.map((facility, index) => (
            <div key={index} className="flex items-center gap-4">
                <textarea
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-gray-300 mb-4"
                    placeholder={`المرفق ${index + 1}`}
                    value={facility.arabicpoints}
                    onChange={(e) =>
                        handleDynamicChange(
                            index,
                            "arabicpoints",
                            e.target.value,
                            setOtherFacilities,
                            otherFacilities
                        )
                    }
                ></textarea>
            </div>
        ))}
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
                            Add Plan
                        </Button>
                    </div>
                </form>
            </div>
        </div>

    )
}
