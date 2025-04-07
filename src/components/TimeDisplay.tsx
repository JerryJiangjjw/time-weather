import React, { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Lunar, HolidayUtil, Solar } from 'lunar-typescript';

interface TimeDisplayProps {
  className?: string;
}

// 简单的节日数据
const FESTIVALS = [
  { month: 1, day: 1, name: '元旦' },
  { month: 2, day: 14, name: '情人节' },
  { month: 3, day: 8, name: '妇女节' },
  { month: 3, day: 12, name: '植树节' },
  { month: 4, day: 1, name: '愚人节' },
  { month: 5, day: 1, name: '劳动节' },
  { month: 5, day: 4, name: '青年节' },
  { month: 6, day: 1, name: '儿童节' },
  { month: 9, day: 10, name: '教师节' },
  { month: 10, day: 1, name: '国庆节' },
  { month: 12, day: 25, name: '圣诞节' },
];

const TimeDisplay: React.FC<TimeDisplayProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [lunar, setLunar] = useState<Lunar>(Lunar.fromDate(new Date()));

  // 每秒更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      setCurrentTime(now);
      
      // 如果日期变了，更新农历
      if (now.date() !== currentTime.date()) {
        setLunar(Lunar.fromDate(now.toDate()));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime]);

  // 格式化时间为 HH:MM:SS
  const formattedTime = currentTime.format('HH:mm:ss');

  // 农历信息
  const lunarYear = lunar.getYearInChinese();
  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();
  const yearGanZhi = lunar.getYearInGanZhi();
  const animal = lunar.getYearShengXiao();
  const jieQi = lunar.getJieQi();
  const baZi = `${lunar.getYearInGanZhi()} ${lunar.getMonthInGanZhi()} ${lunar.getDayInGanZhi()} ${lunar.getTimeInGanZhi()}`;

  // 节假日信息
  const currentMonth = currentTime.month() + 1; // dayjs月份从0开始
  const currentDay = currentTime.date();
  
  // 检查今天是否有节日
  const todayFestival = FESTIVALS.find(
    festival => festival.month === currentMonth && festival.day === currentDay
  );
  
  // 获取农历节日
  const solar = Solar.fromYmd(currentTime.year(), currentMonth, currentDay);
  const lunarHolidays = HolidayUtil.getHolidays(solar.getJulianDay());

  // 生成日历
  const daysInMonth = currentTime.daysInMonth();
  const firstDayOfMonth = currentTime.startOf('month').day();
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className={`time-display ${className || ''}`}>
      <div className="card time-card">
        {/* 时间日期部分 */}
        <div className="time-section">
          <div className="time">{formattedTime}</div>
          <div className="date">
            {currentTime.format('YYYY年MM月DD日')} {currentTime.format('dddd')}
          </div>
        </div>
        
        {/* 农历信息部分 */}
        <div className="lunar-info">
          <div className="lunar-item">
            <span>{lunarYear}年 {lunarMonth}月 {lunarDay}</span>
          </div>
          {jieQi && (
            <div className="lunar-item">
              <span>{jieQi}</span>
            </div>
          )}
        </div>

        {/* 节假日部分 - 只显示当前节假日 */}
        {(todayFestival || lunarHolidays.length > 0) && (
          <div className="holiday-info">
            {todayFestival && <div className="festival">{todayFestival.name}</div>}
            {lunarHolidays.map((holiday, index) => (
              <div key={index} className="festival">{holiday.getName()}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeDisplay; 