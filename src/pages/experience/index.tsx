import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ActivityCard from '@/components/ActivityCard';
import { activityList, activityTypes } from '@/data/activities';
import type { Activity } from '@/types';

const ExperiencePage: React.FC = () => {
  const [activeType, setActiveType] = useState('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[ExperiencePage] 页面加载');
    loadActivities();
  }, [activeType]);

  const loadActivities = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        let filtered = activityList;
        if (activeType !== 'all') {
          filtered = activityList.filter(a => a.type === activeType);
        }
        setActivities(filtered);
        setLoading(false);
        console.log('[ExperiencePage] 活动加载完成, 数量:', filtered.length);
      }, 300);
    } catch (error) {
      console.error('[ExperiencePage] 活动加载失败:', error);
      setLoading(false);
    }
  };

  const onPullDownRefresh = () => {
    console.log('[ExperiencePage] 下拉刷新');
    loadActivities();
    Taro.stopPullDownRefresh();
  };

  const handleTypeChange = (type: string) => {
    console.log('[ExperiencePage] 切换分类:', type);
    setActiveType(type);
  };

  const handleJoin = (activity: Activity) => {
    console.log('[ExperiencePage] 报名活动:', activity.title);
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

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>文化体验</Text>
        <Text className={styles.headerSubtitle}>感受客家文化，体验传统民俗</Text>
      </View>

      <View className={styles.content}>
        <ScrollView
          className={styles.categoryTabs}
          scrollX
          enhanced
          showScrollbar={false}
        >
          {activityTypes.map(type => (
            <View
              key={type.key}
              className={classnames(styles.categoryTab, activeType === type.key && styles.active)}
              onClick={() => handleTypeChange(type.key)}
            >
              {type.label}
            </View>
          ))}
        </ScrollView>

        {loading ? (
          <View className={styles.loading}>加载中...</View>
        ) : activities.length > 0 ? (
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
            <Text className={styles.icon}>📭</Text>
            <Text className={styles.text}>暂无相关活动</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExperiencePage;
