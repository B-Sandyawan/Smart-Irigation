import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center bg-[#EACABF] border border-[#2C2C2C] rounded-[24px] box-border hover:bg-[#dfbaae] transition-colors ${className}`}
    >
      <span className="text-[16px] leading-[1.275em] font-normal text-[#2C2C2C]">
        {children}
      </span>
    </button>
  );
};

export default Button;
