import React from 'react';

const AchievementCard = ({ icon, title, description, titleColor }) => {
  const isImageIcon =
    typeof icon === 'string' &&
    (icon.endsWith('.svg') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg') || icon.includes('/'));

  return (
    <div
      className="min-h-[84px] w-full rounded-[20px] border border-[#5D5A56] bg-[#F3F0EC] px-[14px] py-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.22)]"
    >
      <div className="flex items-center gap-[12px]">
        <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center">
          {isImageIcon ? (
            <img src={icon} alt="Achievement icon" className="h-[54px] w-[54px] object-contain" />
          ) : (
            <span className="text-[42px] leading-none">{icon}</span>
          )}
        </div>

        <div className="flex min-w-0 flex-col leading-tight">
          <h3
            className="text-[15px] font-bold tracking-tight"
            style={{ color: titleColor }}
          >
            {title}
          </h3>
          <p className="mt-[3px] text-[14px] font-medium text-[#2E2E2E]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const AchievementList = ({ achievements }) => {
  return (
    <div className="space-y-3.5 font-sans">
      {achievements.map((achievement, idx) => (
        <AchievementCard
          key={idx}
          icon={achievement.icon}
          title={achievement.title}
          description={achievement.description}
          titleColor={achievement.titleColor}
        />
      ))}
    </div>
  );
};

export default AchievementList;