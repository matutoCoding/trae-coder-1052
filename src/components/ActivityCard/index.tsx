import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Activity } from '@/types';
import { formatPrice, formatDate } from '@/utils';

interface ActivityCardProps {
  activity: Activity;
  onJoin?: (activity: Activity) => void;
}

const typeMap: Record<string, string> = {
  culture: '文化体验',
  tea: '采茶制茶',
  study: '研学接待',
  festival: '节庆活动'
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onJoin }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/activity/index?id=${activity.id}`
    });
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activity.currentParticipants < activity.maxParticipants) {
      if (onJoin) {
        onJoin(activity);
      } else {
        Taro.showToast({
          title: '报名成功！',
          icon: 'success'
        });
        console.log('[ActivityCard] 报名活动:', activity.title);
      }
    }
  };

  const handleImageError = () => {
    console.error('[ActivityCard] 图片加载失败:', activity.image);
  };

  const progress = Math.round((activity.currentParticipants / activity.maxParticipants) * 100);
  const isFull = activity.currentParticipants >= activity.maxParticipants;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.activityImage}
          src={activity.image}
          mode="aspectFill"
          onError={handleImageError}
        />
        <View className={styles.typeTag}>{typeMap[activity.type]}</View>
        <View className={styles.priceTag}>{formatPrice(activity.price)}</View>
      </View>
      
      <View className={styles.content}>
        <Text className={styles.title}>{activity.title}</Text>
        
        <View className={styles.meta}>
          <Text className={styles.metaItem}>📅 {formatDate(activity.date)}</Text>
          <Text className={styles.metaItem}>⏰ {activity.time}</Text>
          <Text className={styles.metaItem}>📍 {activity.location}</Text>
          <Text className={styles.metaItem}>⏱️ {activity.duration}</Text>
        </View>
        
        <Text className={styles.description}>{activity.description}</Text>
        
        <View className={styles.tags}>
          {activity.tags.map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        
        <View className={styles.footer}>
          <View className={styles.progress}>
            <Text>{activity.currentParticipants}/{activity.maxParticipants}人</Text>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${progress}%` }} />
            </View>
          </View>
          
          <Button
            className={classnames(styles.joinBtn, isFull && styles.full)}
            onClick={handleJoin}
            disabled={isFull}
          >
            {isFull ? '已满员' : '立即报名'}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
