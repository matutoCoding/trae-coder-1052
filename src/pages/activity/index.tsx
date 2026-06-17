import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ActivityCard from '@/components/ActivityCard';
import { activityList } from '@/data/activities';
import type { Activity } from '@/types';

const ActivityPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    console.log('[ActivityPage] 页面加载');
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    filterActivities(today);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      filterActivities(selectedDate);
    }
  }, [selectedDate]);

  const filterActivities = (date: string) => {
    const filtered = activityList.filter(a => a.date === date);
    setActivities(filtered);
    console.log('[ActivityPage] 筛选活动:', date, filtered.length);
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: { date: string; day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];
    
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({
        date: d.toISOString().split('T')[0],
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    const today = new Date().toISOString().split('T')[0];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: i,
        isCurrentMonth: true,
        isToday: dateStr === today
      });
    }
    
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d.toISOString().split('T')[0],
        day: i,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  }, [currentDate]);

  const getActivityCount = (date: string) => {
    return activityList.filter(a => a.date === date).length;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (date: string) => {
    console.log('[ActivityPage] 选择日期:', date);
    setSelectedDate(date);
  };

  const handleJoin = (activity: Activity) => {
    console.log('[ActivityPage] 报名活动:', activity.title);
    Taro.showModal({
      title: '确认报名',
      content: `确定要报名参加"${activity.title}"吗？费用：¥${activity.price}`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '报名成功！',
            icon: 'success'
          });
        }
      }
    });
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.calendarSection}>
          <Text className={styles.sectionTitle}>活动日历</Text>
          
          <View className={styles.calendarHeader}>
            <View className={styles.navBtn} onClick={handlePrevMonth}>‹</View>
            <Text className={styles.monthText}>
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </Text>
            <View className={styles.navBtn} onClick={handleNextMonth}>›</View>
          </View>
          
          <View className={styles.weekdays}>
            {weekdays.map(day => (
              <Text key={day} className={styles.weekday}>{day}</Text>
            ))}
          </View>
          
          <View className={styles.days}>
            {calendarDays.map((d, index) => {
              if (!d.isCurrentMonth) {
                return <View key={index} className={classnames(styles.day, styles.empty)} />;
              }
              
              const count = getActivityCount(d.date);
              return (
                <View
                  key={index}
                  className={classnames(
                    styles.day,
                    d.isToday && styles.today,
                    selectedDate === d.date && styles.selected,
                    count > 0 && styles.hasActivity
                  )}
                  onClick={() => handleDayClick(d.date)}
                >
                  <Text className={styles.dayNumber}>{d.day}</Text>
                  {count > 0 && (
                    <Text className={styles.activityCount}>{count}个</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <Text className={styles.sectionTitle}>
          {selectedDate ? `${selectedDate} 活动安排` : '今日活动'}
        </Text>
        
        {activities.length > 0 ? (
          <View className={styles.activityList}>
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onJoin={handleJoin}
              />
            ))}
          </View>
        ) : (
          <View className={styles.empty}>
            <Text className={styles.icon}>📅</Text>
            <Text className={styles.text}>该日期暂无活动安排</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ActivityPage;
