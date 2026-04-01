import React from 'react';

const Input = ({ type = 'text', placeholder, icon, rightIcon, containerStyle, bg }) => {
  return (
    <div className={`relative flex items-center px-[16px] h-full border border-[#A5A5A5] rounded-[16px] box-border ${bg} ${containerStyle}`}>
      {icon && (
        <div className="flex-shrink-0 mr-[12px] flex items-center justify-center w-[24px] h-[24px]">
          {icon}
        </div>
      )}
      <input
        type={type}
        className="flex-grow bg-transparent text-[16px] leading-[1.275em] text-[#000000] placeholder-[#000000] outline-none font-normal"
        placeholder={placeholder}
      />
      {rightIcon && (
        <button type="button" className="flex-shrink-0 ml-[12px] flex items-center justify-center w-[24px] h-[24px] cursor-pointer bg-transparent border-none">
          {rightIcon}
        </button>
      )}
    </div>
  );
};

export default Input;
