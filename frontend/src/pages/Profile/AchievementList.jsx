import React from 'react';

/**
 * AchievementCard Component
 * 
 * Menampilkan achievement individual dengan icon, title, dan description
 * Tipografi: Montserrat Bold untuk title
 */
const AchievementCard = ({ icon, title, description, titleColor, borderColor }) => {
  return (
    <div 
      className="bg-[#FEF9F3] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      
      {/* Achievement Icon & Title */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[18px]">{icon}</span>
        <h3 
          className="text-[11px] font-['Montserrat'] font-bold"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
      </div>

      {/* Achievement Description */}
      <p className="text-[#1a1a1a] text-[10px] font-['Montserrat'] font-normal pl-0">
        {description}
      </p>

    </div>
  );
};

/**
 * AchievementList Component
 * 
 * Menampilkan list dari achievement cards
 * Tipografi: Montserrat untuk semua teks
 */
const AchievementList = ({ achievements }) => {
  return (
    <div className="space-y-2 font-['Montserrat']">
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
