import React from 'react';

/**
 * ProfileInput Component
 * 
 * Komponen input field modular untuk form profile
 * Props: label, type, name, value, onChange, readOnly, required
 * 
 * Tipografi: Montserrat
 * Styling:
 * - Background: Krem (#FEF9F3)
 * - Border: Tipis, light color
 * - Focus: Green ring (#9BC19B)
 */
const ProfileInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  readOnly = false,
  required = false
}) => {
  return (
    <div className="flex flex-col gap-1 font-['Montserrat']">
      {/* Label - MONTSERRAT */}
      <label 
        htmlFor={name}
        className="text-[#1a1a1a] font-['Montserrat'] font-semibold text-[12px] leading-[1.2]"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Input Field - MONTSERRAT */}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        className={`
          w-full h-9 px-3
          bg-[#FFEDD9]
          border border-[#E8D8CC]
          rounded-[10px]
          text-[#1a1a1a] text-[13px] leading-[1.4]
          font-['Montserrat'] font-normal
          transition-all duration-200
          ${readOnly 
            ? 'cursor-not-allowed opacity-75' 
            : 'focus:outline-none focus:ring-2 focus:ring-[#9BC19B] focus:border-transparent'
          }
          ${type === 'password' ? 'tracking-widest' : ''}
        `}
      />
    </div>
  );
};

export default ProfileInput;
