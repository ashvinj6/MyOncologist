import React from 'react';

interface DoctorAvatarProps {
  speaking?: boolean;
}

const DoctorAvatar: React.FC<DoctorAvatarProps> = ({ speaking }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/doctor-avatar.png"
        alt="Doctor Avatar"
        width={220}
        height={220}
        className={`rounded-full object-cover transition-all duration-300 ${speaking ? 'ring-4 ring-blue-400 ring-opacity-60 scale-105 animate-pulse' : ''}`}
        style={{ background: '#f5f6fa' }}
      />
      <div className="mt-4 text-lg font-semibold text-blue-700">MyOncologist</div>
      <div className="text-sm text-gray-500">Your AI Assistant</div>
    </div>
  );
};

export default DoctorAvatar; 