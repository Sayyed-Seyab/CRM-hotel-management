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
    const [RoomAllLang,  setRoomDataAllLang] = useState([]);
    const [Editroom, SetEditroom] = useState();
    const [Restaurants, setRestaurants] = useState([]);
    const [RestaurantAllLang, setRestaurantDataAllLang] = useState([])
    const [cuisineId, setCuisisneID] = useState();
    const [diningId, setDiningId] = useState();
    const [Editrestaurant, SetEditrestaurant] = useState();
    const [LoyaltyAllLang,  setLoyaltyDataAllLang] = useState([])
    const [loyalty, setLoyalty] = useState([]);
    const [Editloyalty, setEditLoyalty] = useState([])
    
    // const [Agentid, setAgentId] = useState()
    const url = 'http://localhost:4000';
    const agentid = "673ef93329933f9da9d46d2a"; // Replace with dynamic agentid if needed
    const password = 'Admin123,' // Replace with actual Agent ID
    const SecretKey = 'mySecretKey123'; // Replace with your actual secret key

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
        const encryptedPassword =  encrypt(password, SecretKey);
        console.log(encryptedPassword) 
        try {
            const response = await axios.get(`${url}/api/admin/getcities/${agentid}`,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                  password: encryptedPassword,
                  agentid: agentid,
                },
                withCredentials: true, // Enable credentials
        });
            let array = [];
            if(!response.data.message.length){
                array.push(response.data.message);
            }else{
                array = response.data.message
            }
            const data = array.map((city) => {
                const nameParts = city.name?.split("|") || ["", ""];
                const captionParts = city.caption?.split("|") || ["", ""];
                const descriptionParts = city.description?.split("|") || ["", ""];

                if (language === "english") {
                    return {
                        ...city,
                        name: nameParts[0],
                        caption: captionParts[0],
                        description: descriptionParts[0],
                    };
                } else {
                    return {
                        ...city,
                        name: nameParts[1],
                        caption: captionParts[1],
                        description: descriptionParts[1],
                    };
                }
            });
            setCities(data);
            setcityDataAllLang(array)


        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // Fetch hotels on component mount or when language changes
    const fetchHotels = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/gethotels/${agentid}`);
            let array = [];
            if(!response.data.message.length){
                array.push(response.data.message);
            }else{
                array = response.data.message
            }
            const data = array.map((hotel) => {
                // Split multilingual fields
                const nameParts = hotel.name?.split("|") || ["", ""];
                const captionParts = hotel.caption?.split("|") || ["", ""];
                const descriptionParts = hotel.description?.split("|") || ["", ""];
                const facilityHeadingParts = hotel.facilityheading?.split("|") || ["", ""];
                const facilityDescriptionParts = hotel.facilitydescription?.split("|") || ["", ""];

                // Map facilities and split by '|'
                const facilities = hotel.facilities.map((facility) => {
                    const nameParts = facility.facility?.split("|") || ["", ""];
                    return {
                        name: language === "english" ? nameParts[0] : nameParts[1],
                        image: facility.facilityimage,
                    };
                });

                const gallery = hotel.gallery.map((item) => ({
                    alt: item.alt,
                    galleryimage: item.galleryimage,
                }));
                // Map policies and split by '|'
                const policies = hotel.policies.map((policy) => {
                    const headingParts = policy.policyheading?.split("|") || ["", ""];
                    const descriptionParts = policy.policydescription?.split("|") || ["", ""];
                    return {
                        heading: language === "english" ? headingParts[0] : headingParts[1],
                        description: language === "english" ? descriptionParts[0] : descriptionParts[1],
                        image: policy.policyimage,
                    };
                });

                // Prepare data based on selected language
                if (language === "english") {
                    return {
                        ...hotel,
                        name: nameParts[0],
                        caption: captionParts[0],
                        description: descriptionParts[0],
                        facilityHeading: facilityHeadingParts[0],
                        facilityDescription: facilityDescriptionParts[0],
                        gallery,
                        facilities,
                        policies,
                    };
                } else {
                    return {
                        ...hotel,
                        name: nameParts[1],
                        caption: captionParts[1],
                        description: descriptionParts[1],
                        facilityHeading: facilityHeadingParts[1],
                        facilityDescription: facilityDescriptionParts[1],
                        gallery,
                        facilities,
                        policies,
                    };
                }
            });

            // Set processed data to state
            setHotels(data); // Data processed for the selected language
            setHotelDataAllLang(array);
            // Original data with all languages
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }

    };

    //Fetch rooms on component mount or when language changes
    const fetchRooms = async () => {
        try {
           
            // const encryptedPassword =  encrypt(password, SecretKey);
            // console.log(encryptedPassword)
            const response = await axios.get(`${url}/api/admin/getrooms/${agentid}`,{
                // headers: {
                //   password: encryptedPassword,
                //   agentid: agentid,
                // },
                withCredentials: true, // Enable credentials
              });
              let array = [];
            if(!response.data.message.length){
                array.push(response.data.message);
            }else{
                array = response.data.message
            }
            const data = array.map((room) => {
                
                // Split multilingual fields
                const nameParts = room.name?.split("|") || ["", ""];
                
                // Map gallery and split fields by '|'
                const gallery = room.gallery.map((item) => ({
                    galleryimage: item.galleryimage,
                    alt: language === "english" ? item.alt?.split("|")[0] : item.alt?.split("|")[1] || "",
                    caption: language === "english" ? item.caption?.split("|")[0] : item.caption?.split("|")[1] || "",
                }));
    
                // Prepare data based on selected language
                return {
                    ...room,
                    name: language === "english" ? nameParts[0] : nameParts[1],
                    gallery,
                };
            });
    
            // Set processed data to state
            setRooms(data); // Data processed for the selected language
          setRoomDataAllLang(array); // Original data with all languages
        } catch (error) {
            console.error("Error fetching rooms:", error);
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
            console.log(response.data.message)
          
            let array = [];
        if (response.data.message) {
            // Ensure message is an array; if not, wrap it in one
            array = Array.isArray(response.data.message) 
                ? response.data.message 
                : [response.data.message];
        }
            setRestaurantDataAllLang(array); // Unprocessed original data
            
           
            
    
            // Extract and process data
           const  data = response.data.message.map((restaurant) => {
                // Split name and description into language-specific parts
                const nameParts = restaurant.name?.split("|") || ["", ""];
                const descriptionParts = restaurant.description?.split("|") || ["", ""];
    
                // Process gallery (image array) with multilingual fields
                const gallery = (restaurant.image || []).map((item) => {
                    const imageObj = item.resturantimage || {}; // Default to an empty object if rerturantimage is missing
                
                    return {
                        url: imageObj.url || "", // Fallback to empty string if url is missing
                        alt: language === "english"
                            ? (imageObj.alt?.split("|")[0] || imageObj.alt || "") // Check if alt exists and split it
                            : (imageObj.alt?.split("|")[1] || ""),
                        caption: language === "english"
                            ? (imageObj.caption?.split("|")[0] || imageObj.caption || "") // Check if caption exists and split it
                            : (imageObj.caption?.split("|")[1] || ""),
                    };
                });
                
                // Process dining array
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
    
                // Process cuisines array
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
    
                // Return processed restaurant object
                return {
                    ...restaurant,
                    name: language === "english" ? nameParts[0] : nameParts[1],
                    description: language === "english" ? descriptionParts[0] : descriptionParts[1],
                    gallery,
                    dining,
                    cuisines,
                };
            });
    
            // Set processed data to state
            setRestaurants(data); // For selected language
          
    
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    //fetch loyalty
    const fetchloyalty = async () => {
        try {
            // Fetch restaurant data from the API
            const response = await axios.get(`${url}/api/admin/loyaltyplans/${agentid}`, {
                withCredentials: true, // Enable credentials if needed
            });
       
            let array = [];
            if(!response.data.message.length){
                array.push(response.data.message);
            }else{
                array = response.data.message
            }
            setLoyaltyDataAllLang(array); // Unprocessed original data
            
           
            
    
            // Extract and process data
           const  data = array.map((loyalty) => {
              
     // Map gallery and split fields by '|'
                const otherfacilities = loyalty.otherfacilities.map((item) => ({
                    point: language === "english" ? item.point?.split("|")[0] : item.alt?.split("|")[1] || "",
                 
                   
                }));

                 // Prepare data based on selected language
                 return {
                    ...loyalty,
                    otherfacilities,
                };
               
                       
                });
    
               
            
    
            // Set processed data to state
            setLoyalty(data); // For selected language
           
          
    
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };
    
    
    useEffect(() => {
        fetchCities()
        fetchHotels();
        fetchRooms();
        fetchrestaurants();
        fetchloyalty();
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
        agentid,
        EditHotel,
        SetEditHotel,
        HotelDataAllLang,
        setHotelDataAllLang,
        Rooms,
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
        
    }
    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider