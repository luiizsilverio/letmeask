import { ButtonHTMLAttributes } from "react";

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
  isAdmin?: boolean  
}

export function Button({ 
  isOutlined = false, 
  isAdmin = false,
  ...props }: ButtonProps) {  
  return (
    <button 
      className={`button ${!isOutlined || 'outlined'}`}
      style={isAdmin ? {backgroundColor: "#5836be"} : {}}
      {...props} 
    />
  )
}