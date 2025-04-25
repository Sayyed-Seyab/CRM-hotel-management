import { StoreContext } from '@/context/context';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';


const  AdminAuth = () =>{
    const [loading, setloading] = useState(true);
    const {admin} = useContext(StoreContext);

    
    useEffect(() => {
        // Simulating an async check, you can replace it with actual async operations if needed
        setTimeout(() => {
            setloading(false);
        }, 1000); // Adjust the delay as per your needs
    }, [admin]);

        if(loading ){
            return   <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        }

    
 
    return  admin?.value.role === 'admin'? <Outlet/> : <Navigate to='/'/>
  
}
  

export default AdminAuth
