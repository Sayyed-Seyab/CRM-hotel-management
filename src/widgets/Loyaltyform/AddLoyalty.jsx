import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Textarea, Typography, Input } from '@material-tailwind/react';
import { RiChatDeleteFill } from "react-icons/ri";

import axios from 'axios';
import { StoreContext } from '@/context/context';
import { useNavigate } from 'react-router-dom';
import { BiSolidMessageAdd } from "react-icons/bi";
import { toast } from 'react-toastify';

export default function AddLoyalty() {
    const { url, agentid, SetTostMsg, SetErrortMsg, ErrortMsg } = useContext(StoreContext);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const [otherFacilities, setOtherFacilities] = useState([{ point: '', arabicpoints:'' }]);
    const [loyaltyPlanData, setLoyaltyPlanData] = useState({
        agentid: agentid,
        plantype: '',
        loyaltyplanimage: '',
        alt: '',
        colorcode: '',
        minstay: '',
        maxstay: '',
        signup: false,
        signupdiscountpercent: '',
        signupbonus: '',
        valueearned: '',
        valueredeemed: '',
        minimumpointstoredeem: '',
        otherfacilities: otherFacilities,
    });
  
    const handleDynamicChange = (index, field, value, setter, state) => {
        const updated = [...state];
        updated[index][field] = value;
        setter(updated);
    };

    const addField = (setter, defaultValue) => {
        setter((prev) => [...prev, defaultValue]);
    };

    const removeField = (index, setter, state) => {
        if (state.length > 1) {
            const updated = state.filter((_, i) => i !== index);
            setter(updated);
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
        formdata.append('signup', loyaltyPlanData.signup);
        formdata.append('signupdiscountpercent', loyaltyPlanData.signupdiscountpercent);
        formdata.append('signupbonus', loyaltyPlanData.signupbonus);
        formdata.append('valueearned', loyaltyPlanData.valueearned);
        formdata.append('valueredeemed', loyaltyPlanData.valueredeemed);
        formdata.append('minimumpointstoredeem', loyaltyPlanData.minimumpointstoredeem);

         // Join English and Arabic points for each facility
    const formattedFacilities = loyaltyPlanData.otherfacilities.map((facility) => ({
        point: `${facility.point} | ${facility.arabicpoints}`, // Combine English and Arabic
    }));

    // Add otherFacilities as JSON string
    formdata.append('otherfacilities', JSON.stringify(formattedFacilities));
        try {
            const response = await axios.post(`${url}/api/admin/loyaltyplan`, formdata, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
              
                SetTostMsg(response.data.message);
                navigate('/dashboard/loyalty');
            } else {
                 toast.error(response.data.Message);
            }
        } catch (error) {
            console.error('Error adding loyalty plan:', error);
            alert('Error adding loyalty plan');
        }
    };

    useEffect(() => {
        console.log(loyaltyPlanData);
        console.log(otherFacilities);
         if (ErrortMsg !== null) {
                    // Show toast and reset state after a delay
                    const toastTimeout = setTimeout(() => {
                        toast.error(ErrortMsg);
                    }, 1000);
        
                    const resetTimeout = setTimeout(() => {
                        SetErrortMsg(null); // Reset state after 5 seconds
                    }, 5000);
        
                    // Cleanup timeouts on component unmount
                    return () => {
                        clearTimeout(toastTimeout);
                        clearTimeout(resetTimeout);
                    };
                }
    }, [loyaltyPlanData, otherFacilities]);
  return (
    <div><div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
    <Typography variant="h2" className="font-bold text-gray-700 text-center mb-4">
        Add Loyalty Plan
    </Typography>
    
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[600px] overflow-y-auto">
        <div className="pl-5 pr-5 grid grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Basic Details */}
            <div className="space-y-4 grid-cols-1 gap-4">
                <Typography variant="h6" className="text-gray-700 font-medium mb-4">
                    Basic Details
                </Typography>

                 {/* Other Facilities */}
                 <div>
                    <label className="block text-gray-700 font-medium mb-2">Other Facilities</label>
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
                                onClick={() => removeField(index, setOtherFacilities, otherFacilities)}
                                color="red"
                                style={{ fontSize: '20px', cursor: 'pointer' }}
                            />
                             <BiSolidMessageAdd
                        className=""
                        onClick={() =>
                            addField(setOtherFacilities, { point: "" })
                        }
                        style={{fontSize:'20px', cursor:'pointer'}}
                        
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
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Selected City"
                                        className="mt-4 h-20 w-20 object-cover rounded-lg border"
                                    />
                                )}
                            </div>

                {/* Color Code */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Color Code</label>
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
                    <label className="block text-gray-700 font-medium mb-2">Minimum Stay</label>
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
                    <label className="block text-gray-700 font-medium mb-2">Maximum Stay</label>
                    <Input
                        size="lg"
                        type="number"
                        label="Maximum Stay"
                        name="maxstay"
                        value={loyaltyPlanData.maxstay}
                        onChange={handleChange}
                    />
                </div>

                {/* Signup Options */}
                {loyaltyPlanData.plantype !== 'Silver'?  '' : (
                      <div>
                      <label className="block text-gray-700 font-medium mb-2">Signup Bonus Eligibility</label>
                      <select
                          name="signup"
                          value={loyaltyPlanData.signup || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                    
                     >
                      <option value="" disabled>
                                          Select sign-Up bonus
                                      </option>
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                      </select>
                  </div>
                )}
              
              {/* signup discount */}
              {loyaltyPlanData.plantype !== 'Silver'?  '' :(
                  <div>
                  <label className="block text-gray-700 font-medium mb-2">Signup Discount (%)</label>
                  <Input
                      size="lg"
                      type="number"
                      label="Signup Discount"
                      name="signupdiscountpercent"
                      value={loyaltyPlanData.signupdiscountpercent}
                      onChange={handleChange}
                  />
              </div>
              )}
              

                 {/* Points and Other Details */}
             <div className="space-y-4">
                <Typography variant="h6" className="text-gray-700 font-medium mb-4">
                    Points and Facilities
                </Typography>

                {/* Signup Bonus */}
                {loyaltyPlanData.plantype !== 'Silver'?  '' :(
                    <div>
                    <label className="block text-gray-700 font-medium mb-2">Signup Bonus Points</label>
                    <Input
                        size="lg"
                        type="number"
                        label="Signup Bonus"
                        name="signupbonus"
                        value={loyaltyPlanData.signupbonus}
                        onChange={handleChange}
                    />
                </div>
                )}
                

                {/* Value Earned per SAR */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Points Earned per SAR</label>
                    <Input
                        size="lg"
                        type="number"
                        label="Value Earned"
                        name="valueearned"
                        value={loyaltyPlanData.valueearned}
                        onChange={handleChange}
                    />
                </div>

                {/* Value Redeemed per SAR */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Points Redeemed per SAR</label>
                    <Input
                        size="lg"
                        type="number"
                        label="Value Redeemed"
                        name="valueredeemed"
                        value={loyaltyPlanData.valueredeemed}
                        onChange={handleChange}
                    />
                </div>

                {/* Minimum Points to Redeem */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Minimum Points to Redeem</label>
                    <Input
                        size="lg"
                        type="number"
                        label="Minimum Points"
                        name="minimumpointstoredeem"
                        value={loyaltyPlanData.minimumpointstoredeem}
                        onChange={handleChange}
                    />
                </div>

               
            </div>
            </div>

            <div className="cols-1">
    <Typography variant="h6" className="text-gray-700 font-medium mb-4">
        تفاصيل باللغة العربية
    </Typography>
    {/* المرافق الأخرى */}
    <div className="">
        <label className="block text-gray-700 font-medium mb-2">المرافق الأخرى</label>
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
            <Button type="submit" className="w-40 bg-gray-900" color="black" fullWidth>
                ADD PLAN
            </Button>
        </div>
    </form>
</div>
</div>
  )
}
