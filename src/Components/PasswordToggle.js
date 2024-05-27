import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordToggle = ({ passwordVisible, togglePasswordVisibility }) => {
  return (
    <button 
      type="button"
      onClick={togglePasswordVisibility}
      style={{
        position: 'absolute', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        border: 'none', 
        background: 'none',
        cursor: 'pointer', 
        outline: 'none'
      }}
    >
      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
};

export default PasswordToggle;