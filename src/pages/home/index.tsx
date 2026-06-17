import React, { useState, useEffect } from 'react';
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RoomCard from '@/components/RoomCard';
import ActivityCard from '@/components/ActivityCard';
import StatCard from '@/components/StatCard';
import { roomList } from '@/data/rooms';
import { activityList } from '@/data/activities';
import { statisticsData } from '@/data/statistics';
import type { Room, Activity } from '@/types';

const bannerImages = [
  'https://picsum.photos/id/1082/750/400',
  'https://picsum.photos/id/1036/750/400',
  'https://picsum.photos/id/1039/750/400',
  'https://picsum.photos/id/1044/750/400'
];

const quickEntries = [
  { icon: '🍽️', label: '餐饮预订', color: '#E8D5C4', path: '/pages/dining/index' },
  { icon: '🎉', label: '活动安排', color: '#D4E6D5', path: '/pages/activity/index' },
  { icon: '↩️', label: '退订处理', color: '#F5E0D3', path: '/pages/refund/index' },
  { icon: '📊', label: '收益统计', color: '#E8D5C4', path: '/pages/statistics/index' }
];

const HomePage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[HomePage] 页面加载');
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setRooms(roomList.filter(r => r.status === 'available').slice(0, 3));
        setActivities(activityList.slice(0, 2));
        setLoading(false);
        console.log('[HomePage] 数据加载完成');
      }, 500);
    } catch (error) {
      console.error('[HomePage] 数据加载失败:', error);
      setLoading(false);
    }
  };

  const onPullDownRefresh = () => {
    console.log('[HomePage] 下拉刷新');
    loadData();
    Taro.stopPullDownRefresh();
  };

  const handleEntryClick = (path: string) => {
    console.log('[HomePage] 点击快捷入口:', path);
    Taro.navigateTo({ url: path });
  };

  const handleMoreRooms = () => {
    Taro.switchTab({ url: '/pages/tulou/index' });
  };

  const handleMoreActivities = () => {
    Taro.switchTab({ url: '/pages/experience/index' });
  };

  const handleBannerError = (index: number) => {
    console.error('[HomePage] Banner图片加载失败:', index);
  };

  return (
    <View className={styles.page}>
      <Swiper
        className={styles.banner}
        autoplay
        circular
        indicatorDots
        indicatorColor="rgba(255,255,255,0.5)"
        indicatorActiveColor="#ffffff"
      >
        {bannerImages.map((img, index) => (
          <SwiperItem key={index}>
            <Image
              className={styles.bannerImage}
              src={img}
              mode="aspectFill"
              onError={() => handleBannerError(index)}
            />
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.content}>
        <View className={styles.quickEntry}>
          {quickEntries.map((entry, index) => (
            <View
              key={index}
              className={styles.entryItem}
              onClick={() => handleEntryClick(entry.path)}
            >
              <View
                className={styles.entryIcon}
                style={{ backgroundColor: entry.color }}
              >
                {entry.icon}
              </View>
              <Text className={styles.entryLabel}>{entry.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.statRow}>
          <StatCard
            value={statisticsData.todayCheckIn}
            label="今日入住"
            trend={{ value: '12%', direction: 'up' }}
          />
          <StatCard
            value={statisticsData.todayCheckOut}
            label="今日退房"
            trend={{ value: '5%', direction: 'down' }}
          />
        </View>

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>推荐客房</Text>
          <Text className={styles.sectionMore} onClick={handleMoreRooms}>
            查看更多 →
          </Text>
        </View>

        {loading ? (
          <View className={styles.loading}>加载中...</View>
        ) : (
          <View className={styles.roomList}>
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        )}

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>精选活动</Text>
          <Text className={styles.sectionMore} onClick={handleMoreActivities}>
            查看更多 →
          </Text>
        </View>

        {loading ? (
          <View className={styles.loading}>加载中...</View>
        ) : (
          <View className={styles.activityList}>
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default HomePage;
