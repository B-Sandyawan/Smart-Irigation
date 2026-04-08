import React from 'react';

const AchievementCard = ({ icon, title, description, titleColor, borderColor }) => {
  return (
    <div 
      className="bg-white rounded-[16px] p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="text-[24px] flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <h3 
          className="text-[13px] font-bold tracking-tight"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p className="text-[#999] text-[12px] font-medium mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
};

const AchievementList = ({ achievements }) => {
  return (
    <div className="space-y-3 font-sans">
      {achievements.map((achievement, idx) => (
        <AchievementCard
          key={idx}
          icon={achievement.icon}
          title={achievement.title}
          description={achievement.description}
          titleColor={achievement.titleColor}
          borderColor={achievement.borderColor}
        />
      ))}
    </div>
  );
};

export default AchievementList;