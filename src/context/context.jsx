import { data } from "autoprefixer";
import axios from "axios";
import { createContext, useEffect, useState } from "react"
import CryptoJS from 'crypto-js';

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [language, setLanguage] = useState("english"); // Default to English
    const [EditCity, SetEditCity] = useState([]);
    const [tostMsg, SetTostMsg] = useState(null);
    const [ErrortMsg, SetErrortMsg] = useState(null);
    const [cities, setCities] = useState([]); // State for cities data
    const [cityDataAllLang, setcityDataAllLang] = useState([])
    const [hotels, setHotels] = useState([])
    const [EditHotel, SetEditHotel] = useState()
    const [HotelDataAllLang, setHotelDataAllLang] = useState([])
    const [Rooms, setRooms] = useState([]);
    const [RoomAllLang, setRoomDataAllLang] = useState([]);
    const [Editroom, SetEditroom] = useState();
    const [Restaurants, setRestaurants] = useState([]);
    const [RestaurantAllLang, setRestaurantDataAllLang] = useState([])
    const [cuisineId, setCuisisneID] = useState();
    const [diningId, setDiningId] = useState();
    const [Editrestaurant, SetEditrestaurant] = useState();
    const [LoyaltyAllLang, setLoyaltyDataAllLang] = useState([])
    const [loyalty, setLoyalty] = useState([]);
    const [Editloyalty, setEditLoyalty] = useState([])
    const [noLoyaltyMessage, setNoLoyaltyMessage] = useState("");
    const [loading, setloading] = useState(true);
    const [TravelAgent, SetTravelAgent] = useState([]);
    const [EditTravelAgent, SetEditTravelAgent] = useState([]);
    const [TravelAgentTransection, SetTravelAgentTransection] = useState([]);
    const [admin, setadmin] = useState(null)
    const [agentid, setAgentId] = useState()
    const [cityloading, setcityloading] = useState(true);
    const [hotelloading, sethotelloading] =useState(true);
    const [roomloading, setroomloading] = useState(true);
    const [restaurantloading, setrestaurantloading] = useState(true);
    const [loyaltyloading, setloyaltyloading] = useState(true);
    const [travelagentloading, settravelagentloading] = useState();
    const [transcloading, settranscloading] = useState();
 const brand = {
    // id: "673ef93329933f9da9d46d2a",
    id:"67657595591b7c8a9580623b"
}
const url = 'https://crmapi.jawartaibah.com';
// const url = "http://localhost:4000"

// const agentid = "67657595591b7c8a9580623b"; 
const password = 'U2FsdGVkX1+eiDyn70zL5wGfxOLIHGq6nVeOsnE2kTc=,' // Replace with actual Agent ID
const SecretKey = 'mySecretKey123'; // Replace with your actual secret key
    useEffect(()=>{
        getLocalStorageWithExpiry("adminData")
        const storedAdminData = localStorage.getItem('adminData');
        const AdminData = JSON.parse(storedAdminData)

        if (AdminData) {
            const a = setadmin(AdminData);
            console.log(AdminData)
            setAgentId(AdminData.value.agentid)
        }else{
            setAgentId(brand.id)
        }
       
    },[agentid])

console.log(admin)
   

    //password Admin123,
    // Encrypt data using CryptoJS AES
    function encrypt(data, Key) {

        try {
            // Convert the data to a string if it's not already
            const stringData = typeof data === 'string' ? data : JSON.stringify(data);
            const cipherText = CryptoJS.AES.encrypt(stringData, Key).toString();

            return cipherText;
        } catch (error) {
            console.log("Encryption error:", error);
            return null; // Handle encryption error
        }
    }
    // Fetch cities on component mount or when language changes
    const fetchCities = async () => {
        const encryptedPassword = encrypt(password, SecretKey); // Encrypt password
        console.log(encryptedPassword);

        try {
            const response = await axios.get(`${url}/api/admin/getcities/${agentid}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    password: encryptedPassword,
                    agentid: agentid,
                },
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setCities([]); // Reset cities state to empty if no data
                setcityDataAllLang([]); // Reset unprocessed data
                setcityloading(false)
                return; // Exit early if no data
            }

            const processedData = rawData.map((city) => {
                const nameParts = city.name?.split("|") || ["", ""];
                const captionParts = city.caption?.split("|") || ["", ""];
                const descriptionParts = city.description?.split("|") || ["", ""];

                return {
                    ...city,
                    name: language === "english" ? nameParts[0] : nameParts[1],
                    caption: language === "english" ? captionParts[0] : captionParts[1],
                    description: language === "english" ? descriptionParts[0] : descriptionParts[1],
                };
            });

            setCities(processedData); // Processed data for selected language
            setcityDataAllLang(rawData); // Original data with all languages
            setcityloading(false)
        } catch (error) {
            console.error("Error fetching cities:", error);
            setCities([]); // Reset cities state in case of an error
        }
    };


    // Fetch hotels on component mount or when language changes
    const fetchHotels = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/gethotels/${agentid}`);

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];
            console.log(rawData)
            if (rawData.length === 0) {
                console.log('here')
                setHotels([]); // Reset state to empty if no data
                setHotelDataAllLang([]); // For unprocessed data
                sethotelloading(false)
                return; // Exit early if no data
            }

            const processedData = rawData.map((hotel) => {
                // Split multilingual fields
                const nameParts = hotel.name?.split("|") || ["", ""];
                const city = hotel.city?.name?.split("|") || ["", ""];
                const captionParts = hotel.caption?.split("|") || ["", ""];
                const descriptionParts = hotel.description?.split("|") || ["", ""];
                const facilityHeadingParts = hotel.facilityheading?.split("|") || ["", ""];
                const facilityDescriptionParts = hotel.facilitydescription?.split("|") || ["", ""];

                // Map facilities
                const facilities = (hotel.facilities || []).map((facility) => {
                    const nameParts = facility.facility?.split("|") || ["", ""];
                    return {
                        name: language === "english" ? nameParts[0] : nameParts[1],
                        image: facility.facilityimage || "",
                    };
                });

                // Map gallery
                const gallery = (hotel.gallery !== null ? hotel.gallery : []).map((item) => ({
                    alt: item.alt || "",
                    galleryimage: item.galleryimage || "",
                }));

                // Map policies
                const policies = (hotel.policies || []).map((policy) => {
                    const headingParts = policy.policyheading?.split("|") || ["", ""];
                    const descriptionParts = policy.policydescription?.split("|") || ["", ""];
                    return {
                        heading: language === "english" ? headingParts[0] : headingParts[1],
                        description: language === "english" ? descriptionParts[0] : descriptionParts[1],
                        image: policy.policyimage || "",
                    };
                });

                // Return processed hotel object
                return {
                    ...hotel,
                    name: language === "english" ? nameParts[0] : nameParts[1],
                    city: language === "english" ? city[0] : city[1],
                    caption: language === "english" ? captionParts[0] : captionParts[1],
                    description: language === "english" ? descriptionParts[0] : descriptionParts[1],
                    facilityHeading: language === "english" ? facilityHeadingParts[0] : facilityHeadingParts[1],
                    facilityDescription: language === "english" ? facilityDescriptionParts[0] : facilityDescriptionParts[1],
                    gallery,
                    facilities,
                    policies,
                };
            });

            // Set processed data to state
            setHotels(processedData); // Data processed for the selected language
            setHotelDataAllLang(rawData); // Original data with all languages
            sethotelloading(false)
            console.log(hotelloading)
        } catch (error) {
            console.error("Error fetching hotels:", error);
            setHotels([]); // Reset state to empty in case of an error
        }
    };


    //Fetch rooms on component mount or when language changes
    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/getrooms/${agentid}`, {
                withCredentials: true, // Enable credentials
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setRooms([]); // Reset state to empty if no data
                setRoomDataAllLang([]); // For unprocessed data
                setroomloading(false)
                return; // Exit early if no data
            }

            const processedData = rawData.map((room) => {
                const nameParts = room.name?.split("|") || ["", ""];

                const gallery = (room.gallery || []).map((item) => ({
                    galleryimage: item.galleryimage || "",
                    alt: language === "english" ? item.alt?.split("|")[0] : item.alt?.split("|")[1] || "",
                    caption: language === "english" ? item.caption?.split("|")[0] : item.caption?.split("|")[1] || "",
                }));

                return {
                    ...room,
                    name: language === "english" ? nameParts[0] : nameParts[1],
                    gallery,
                };
            });

            // Set processed data to state
            setRooms(processedData); // Data processed for the selected language
            setRoomDataAllLang(rawData); // Original data with all languages
            setroomloading(false)
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setRooms([]); // Reset state to empty in case of an error
        }
    };



    //Fetch restaurants on component mount or when language changes 
    //Fetch rooms on component mount or when language changes
    const fetchrestaurants = async () => {
        try {
            // Fetch restaurant data from the API
            const response = await axios.get(`${url}/api/admin/getresturants/${agentid}`, {
                withCredentials: true, // Enable credentials if needed
            });

            // Safely handle the response
            const rawData = Array.isArray(response.data.message) ? response.data.message : [];

            if (rawData.length === 0) {
                setRestaurants([]); // Set state to empty if no data
                setRestaurantDataAllLang([]); // For unprocessed data
                setrestaurantloading(false)
                return; // Exit early if no data
            }

            setRestaurantDataAllLang(rawData); // Unprocessed original data

            // Process data for selected language
            const processedData = rawData.map((restaurant) => {
                const nameParts = restaurant.name?.split("|") || ["", ""];
                const descriptionParts = restaurant.description?.split("|") || ["", ""];

                const gallery = (restaurant.image || []).map((item) => {
                    const imageObj = item.resturantimage || {};
                    return {
                        url: imageObj.url || "",
                        alt: language === "english"
                            ? (imageObj.alt?.split("|")[0] || imageObj.alt || "")
                            : (imageObj.alt?.split("|")[1] || ""),
                        caption: language === "english"
                            ? (imageObj.caption?.split("|")[0] || imageObj.caption || "")
                            : (imageObj.caption?.split("|")[1] || ""),
                    };
                });

                const dining = restaurant.dining.map((diningItem) => {
                    const headingParts = diningItem.heading?.split("|") || ["", ""];
                    const descParts = diningItem.desc?.split("|") || ["", ""];
                    return {
                        ...diningItem,
                        heading: language === "english" ? headingParts[0] : headingParts[1],
                        desc: language === "english" ? descParts[0] : descParts[1],
                        diningimage: {
                            ...diningItem.diningimage,
                            alt: language === "english" ? diningItem.diningimage.alt?.split("|")[0] : diningItem.diningimage.alt?.split("|")[1] || "",
                            caption: language === "english" ? diningItem.diningimage.caption?.split("|")[0] : diningItem.diningimage.caption?.split("|")[1] || "",
                        },
                        backgroundimage: {
                            ...diningItem.backgroundimage,
                            alt: language === "english" ? diningItem.backgroundimage.alt?.split("|")[0] : diningItem.backgroundimage.alt?.split("|")[1] || "",
                            caption: language === "english" ? diningItem.backgroundimage.caption?.split("|")[0] : diningItem.backgroundimage.caption?.split("|")[1] || "",
                        },
                    };
                });

                const cuisines = restaurant.cuisines.map((cuisineItem) => {
                    const nameParts = cuisineItem.cuisinename?.split("|") || ["", ""];
                    return {
                        ...cuisineItem,
                        cuisinename: language === "english" ? nameParts[0] : nameParts[1],
                        cuisineimage: {
                            ...cuisineItem.cuisineimage,
                            alt: language === "english" ? cuisineItem.cuisineimage.alt?.split("|")[0] : cuisineItem.cuisineimage.alt?.split("|")[1] || "",
                            caption: language === "english" ? cuisineItem.cuisineimage.caption?.split("|")[0] : cuisineItem.cuisineimage.caption?.split("|")[1] || "",
                        },
                    };
                });

                return {
                    ...restaurant,
                    name: language === "english" ? nameParts[0] : nameParts[1],
                    description: language === "english" ? descriptionParts[0] : descriptionParts[1],
                    gallery,
                    dining,
                    cuisines,
                };
            });

            setRestaurants(processedData); // Update state with processed data
            setrestaurantloading(false)
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            setRestaurants([]); // Reset state to empty in case of an error
        }
    };


    const fetchloyalty = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/loyaltyplans/${agentid}`, {
                withCredentials: true, // Enable credentials if needed
            });

            // Safely handle the response
            const data = Array.isArray(response.data.message) ? response.data.message : [];
            setLoyaltyDataAllLang(data)
            if (data.length === 0) {
                setLoyalty([]); // Set empty state if no data
                setloyaltyloading(false)
            } else {
                const processedData = data.map((loyalty) => ({
                    ...loyalty,
                    otherfacilities: loyalty.otherfacilities.map((item) => ({
                        point: language === "english" ? item.point?.split("|")[0] : item.alt?.split("|")[1] || "",
                    })),
                }));
                setLoyalty(processedData); // Update state with processed data
                setloyaltyloading(false)
            }
        } catch (error) {
            console.error("Error fetching loyalty plans:", error);
            setLoyalty([]); // Reset state to empty in case of an error
        }
    };

    //SetTravelAgent
    const fetchTravelAgent = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/getusers/${agentid}`, {
                headers: {
                    password, // Replace with the actual password
                    agentid,        // Use the variable value for agentid
                },
                withCredentials: true, // Enable credentials if needed
            });

            console.log(response)
            // Safely handle the response
            const data = Array.isArray(response.data.message) ? response.data.message : [];

            if (data.length === 0) {
                SetTravelAgent([]); // Set empty state if no data
                settravelagentloading(false)
            }
            const filterTravelAgent = data.filter((user)=> user.role === "travelagent")
            console.log(data)
            SetTravelAgent(data)
            settravelagentloading(false)

        } catch (error) {
            console.error("Error fetching Travel agent:", error);
            SetTravelAgent([]); // Reset state to empty in case of an error
        }
    };
    //gettravelagenttransection
    const fetchTravelAgentTransection = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/gettravelagenttransection/${agentid}`, {
                headers: {
                    password, // Replace with the actual password
                    agentid,        // Use the variable value for agentid
                },
                withCredentials: true, // Enable credentials if needed
            });

            console.log(response)
            // Safely handle the response
            const data = Array.isArray(response.data.message) ? response.data.message : [];

            if (data.length === 0) {
                SetTravelAgentTransection([]); // Set empty state if no data
                settranscloading(false)
            }
            SetTravelAgentTransection(data)
            settranscloading(false)
        } catch (error) {
            console.error("Error fetching Travel agent:", error);
            SetTravelAgentTransection([]); // Reset state to empty in case of an error
        }
    };

    const getLocalStorageWithExpiry = (key) => {
        const itemStr = localStorage.getItem(key);
      
        if (!itemStr) return null;
      
        const item = JSON.parse(itemStr);
        const now = new Date();
      
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
      
        return item.value;
      };

    useEffect(() => {
       
        fetchCities()
        fetchHotels();
        fetchRooms();
        fetchTravelAgentTransection();
        fetchrestaurants();
        fetchloyalty();
        fetchTravelAgent();
    }, [])

    

    const ContextValue = {
        url,
        language,
        setLanguage,
        EditCity,
        SetEditCity,
        tostMsg,
        SetTostMsg,
        ErrortMsg,
        SetErrortMsg,
        cities,
        setCities,
        fetchCities,
        cityDataAllLang,
        setcityDataAllLang,
        fetchHotels,
        hotels,
        setHotels,
        agentid,
        password,
        EditHotel,
        SetEditHotel,
        HotelDataAllLang,
        setHotelDataAllLang,
        Rooms,
        setRooms,
        RoomAllLang,
        fetchRooms,
        Editroom,
        SetEditroom,
        Restaurants,
        RestaurantAllLang,
        fetchrestaurants,
        cuisineId,
        setCuisisneID,
        diningId,
        setDiningId,
        SetEditrestaurant,
        Editrestaurant,
        LoyaltyAllLang,
        loyalty,
        Editloyalty,
        setEditLoyalty,
        fetchloyalty,
        loading,
        setloading,
        TravelAgent,
        fetchTravelAgent,
        EditTravelAgent,
        SetEditTravelAgent,
        TravelAgentTransection,
        SetTravelAgentTransection,
        fetchTravelAgentTransection,
        admin,
        setadmin,
        cityloading,
        hotelloading,
        roomloading,
        restaurantloading,
        loyaltyloading,
        travelagentloading,
        transcloading,
        setAgentId,

    }
    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider