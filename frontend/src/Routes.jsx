import { createBrowserRouter } from "react-router-dom";
import Home from "./features/Dashboard/Home";
import Login from "./features/Authentication/pages/Login";
import Protected from "./features/Authentication/components/Protected";


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login></Login>
    },
    {
        path:"/",
        element:<Protected><Home></Home></Protected>
    },
    
])