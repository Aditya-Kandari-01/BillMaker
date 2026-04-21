import { createBrowserRouter } from "react-router-dom";
import Home from "./features/Dashboard/pages/Home";
import Login from "./features/Authentication/pages/Login";
import Protected from "./features/Authentication/components/Protected";
import Order from "./features/consignment/pages/Order"
import PastOrders from "./features/consignment/pages/PastOrders";
import NewCustomer from "./features/Dashboard/pages/NewCustomer";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login></Login>
    },
    {
        path:"/",
        element:<Protected><Home></Home></Protected>
    },
    {
        path:"/consignment",
        element:<Protected><Order></Order></Protected>
    },
    {
        path:"/pastOrders",
        element:<Protected><PastOrders></PastOrders></Protected>
    },
    {
        path:"/customer",
        element:<Protected><NewCustomer></NewCustomer></Protected>
    }
    
])