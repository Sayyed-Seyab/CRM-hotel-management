import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SignIn } from "./pages/auth";
import AdminAuth from "./AdminAuth/AdminAuth";



function App() {
  return (
    <div>
      {/* <LocationPicker/> */}
      <div>
      {/* Your app content */}
      <ToastContainer />
    </div>
   
    <Routes>
    <Route element={<AdminAuth/>}> 
    
      <Route path="/dashboard/*" element={<Dashboard />} />
      {/* <Route path="*" element={<Navigate to="/dashboard/Home" replace />} /> */}
      <Route path='*' element={ <div className="flex items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
    </div>} />
    <Route path='/auth/*' element={ <div className="flex items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
    </div>} />
    </Route>
     <Route path='/' element={<SignIn/>} />
   
    
     
     
    </Routes>
    </div>
  );
}

export default App;
