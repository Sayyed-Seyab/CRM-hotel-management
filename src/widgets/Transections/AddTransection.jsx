import React, { useState, useEffect, useContext } from "react";
import { Card, Input, Button, Typography, Textarea } from "@material-tailwind/react";
import Select from "react-select"; // Import react-select for searchable dropdown
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/context";

export function AddTransaction() {
  const {admin, SetTostMsg, url, agentid, password, users } = useContext(StoreContext);

  const [transactionData, setTransactionData] = useState({
    agentid: agentid,  // Initially set with the context agent ID
    userid:'',
    paymentmethodfile: null,
    refid: "",
    amountavailable: 0,
    addedby: admin.value.id,
   
  });

  const [agents, setAgents] = useState([]);  // To store agent names and ids
  const [previewFile, setPreviewFile] = useState(null);
  const navigate = useNavigate();

 // Fetching agents
 useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `${url}/api/admin/getusers/${agentid}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              agentid,
              password,
            },
          }
        );
        console.log(response)
        if (response.data.success) {
          const filteragents = response.data.message.filter((agnt) => agnt.user.role !== 'user');
          setAgents(
            filteragents.map((agent) => ({
              value: agent.user._id,
              label: agent.user.email,
            }))
          );
        } else {
          toast.error("Failed to load agents");
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("Failed to fetch agents");
      }
    };
    fetchAgents();
  }, [url, agentid, password,agents]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTransactionData({ ...transactionData, paymentmethodfile: file });
      setPreviewFile(URL.createObjectURL(file));
    }
  };

  const handleAgentSelect = (selectedOption) => {
    setTransactionData({ ...transactionData, userid: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("agentid", transactionData.agentid);
    formData.append("userid", transactionData.userid);
    formData.append("refid", transactionData.refid);
    formData.append("amountavailable", transactionData.amountavailable);
    formData.append("minamount", transactionData.minamount);
    formData.append("discount", transactionData.discount);
    formData.append("maxrooms", transactionData.maxrooms);
    formData.append("maxnights", transactionData.maxnights);
    formData.append("addedby", transactionData.addedby);
    if (transactionData.paymentmethodfile) {
      formData.append("paymentmethodfile", transactionData.paymentmethodfile);
    }

    try {
      const response = await axios.post(
        `${url}/api/admin/addtransection`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", agentid, password } }
      );
      console.log(response)

      if (response.data.success) {
        SetTostMsg(response.data.message);
        navigate("/dashboard/transection");
      } else {
        toast.error(response.data.message);
      }

      setTransactionData({
        refid: "",
        amountavailable: 0,
        minamount: 0,
        discount: 0,
        maxrooms: 0,
        maxnights: 0,
        paymentmethodfile: null,
      });
      setPreviewFile(null);
    } catch (error) {
      console.error("Error adding transaction:", error);
      SetTostMsg(error.response?.data?.message || "Failed to add transaction");
    }
  };

  useEffect(()=>{
    console.log(transactionData)
  },[transactionData])

  return (
    <div className="w-full max-w-4xl mt-4 mx-auto bg-white rounded-lg p-6">
      <Typography variant="h2" className="font-bold text-center mb-4">
        Add Transaction
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[420px] overflow-y-auto">
      <div className="pl-5 pr-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Typography variant="h6" className="font-medium col-span-1 lg:col-span-2 mb-4">
    Transaction Details
  </Typography>

  {/* Select Agent */}
  <div>
    <label className="block text-gray-700 font-medium mb-2">Select Agent</label>
    <Select
      options={agents}
      value={agents.find((agent) => agent.value === transactionData.userid)}
      onChange={handleAgentSelect}
      isSearchable={true}
      placeholder="Search and select an agent"
      noOptionsMessage={() => "No agents available"}
    />
  </div>

  {/* Reference ID */}
  <div>
    <label className="block text-gray-700 font-medium mb-2">Reference ID</label>
    <Input
      size="lg"
      label="Reference ID"
      name="refid"
      value={transactionData.refid}
      onChange={handleChange}
      required
    />
  </div>

  {/* Amount */}
  <div>
    <label className="block text-gray-700 font-medium mb-2">Amount</label>
    <Input
      size="lg"
      label="Amount"
      name="amountavailable"
      type="number"
      value={transactionData.amountavailable}
      onChange={handleChange}
      required
    />
  </div>

   {/* Payment Method File */}
   <div className="space-y-2">
    <Typography variant="small" className="font-medium">
    Receipt File
    </Typography>
    <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="text-gray-700">Choose a file</span>
    </label>
    {previewFile && (
      <img
        src={previewFile}
        alt="Selected File"
        className="mt-4 h-32 w-full object-cover rounded-lg border"
      />
    )}
  </div>
</div>


        {/* Submit Button */}
        <div className="p-5">
          <Button type="submit" className="w-40 bg-gray-900" color="black" fullWidth>
            Add Transaction
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddTransaction;
