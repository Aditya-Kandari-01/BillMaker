import React, { Children } from 'react'
import { Navigate } from 'react-router-dom'

const Protected = ({children}) => {
    const user = true;
    if (!user){
        return (
            <Navigate to={"/login"}></Navigate>
        )
    }
  return (
    children
  )
}

export default Protected