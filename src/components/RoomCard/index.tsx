import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Room } from '@/types';
import { formatPrice, getStatusText, getStatusColor, generateStars } from '@/utils';

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/roomDetail/index?id=${room.id}`
    });
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (room.status === 'available') {
      if (onBook) {
        onBook(room);
      } else {
        Taro.navigateTo({
          url: `/pages/booking/index?roomId=${room.id}`
        });
      }
    }
  };

  const handleImageError = () => {
    console.error('[RoomCard] 图片加载失败:', room.images[0]);
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.roomImage}
          src={room.images[0]}
          mode="aspectFill"
          onError={handleImageError}
        />
        <View
          className={styles.statusTag}
          style={{ backgroundColor: getStatusColor(room.status) }}
        >
          {getStatusText(room.status)}
        </View>
      </View>
      
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{room.name}</Text>
          <View className={styles.rating}>
            <Text>{generateStars(room.rating)}</Text>
            <Text className={styles.ratingValue}>{room.rating}</Text>
          </View>
        </View>
        
        <Text className={styles.type}>{room.type} · {room.reviewCount}条评价</Text>
        
        <View className={styles.info}>
          <Text className={styles.infoItem}>{room.bedType}</Text>
          <Text className={styles.infoItem}>{room.area}㎡</Text>
          <Text className={styles.infoItem}>{room.floor}</Text>
          <Text className={styles.infoItem}>可住{room.maxGuests}人</Text>
        </View>
        
        <View className={styles.facilities}>
          {room.facilities.slice(0, 4).map((facility, index) => (
            <Text key={index} className={styles.facilityTag}>{facility}</Text>
          ))}
          {room.facilities.length > 4 && (
            <Text className={styles.facilityTag}>+{room.facilities.length - 4}</Text>
          )}
        </View>
        
        <View className={styles.footer}>
          <View className={styles.price}>
            <Text className={styles.currentPrice}>{formatPrice(room.price)}</Text>
            <Text className={styles.originalPrice}>{formatPrice(room.originalPrice)}</Text>
            <Text className={styles.night}>/晚</Text>
          </View>
          
          <Button
            className={classnames(styles.bookBtn, room.status !== 'available' && styles.disabled)}
            onClick={handleBook}
            disabled={room.status !== 'available'}
          >
            {room.status === 'available' ? '立即预订' : getStatusText(room.status)}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default RoomCard;
