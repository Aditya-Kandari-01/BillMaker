import {RouterProvider}from "react-router-dom"
import { router } from "./Routes"

const App = () => {
  return (
    <RouterProvider router = {router}></RouterProvider>
  )
}

export default App