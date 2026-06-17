import React, { useState, useEffect } from 'react';
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { tulouInfo, nearbyAttractions } from '@/data/reviews';
import type { NearbyAttraction } from '@/types';

const TulouPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[TulouPage] 页面加载');
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const onPullDownRefresh = () => {
    console.log('[TulouPage] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const handleAttractionClick = (attraction: NearbyAttraction) => {
    console.log('[TulouPage] 点击景点:', attraction.name);
    Taro.showToast({
      title: `查看${attraction.name}`,
      icon: 'none'
    });
  };

  const handleImageError = (index: number) => {
    console.error('[TulouPage] 图片加载失败:', index);
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
        {tulouInfo.images.map((img, index) => (
          <SwiperItem key={index}>
            <Image
              className={styles.bannerImage}
              src={img}
              mode="aspectFill"
              onError={() => handleImageError(index)}
            />
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.content}>
        <View className={styles.headerCard}>
          <Text className={styles.title}>{tulouInfo.name}</Text>
          <Text className={styles.subtitle}>{tulouInfo.location}</Text>
          <View className={styles.highlights}>
            {tulouInfo.highlights.map((highlight, index) => (
              <Text key={index} className={styles.highlightTag}>{highlight}</Text>
            ))}
          </View>
        </View>

        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>始建时间</Text>
            <Text className={styles.infoValue}>{tulouInfo.buildTime}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>占地面积</Text>
            <Text className={styles.infoValue}>{tulouInfo.area}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>现居人口</Text>
            <Text className={styles.infoValue}>{tulouInfo.population}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>历史时长</Text>
            <Text className={styles.infoValue}>300余年</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>历史沿革</Text>
          <Text className={styles.sectionContent}>{tulouInfo.history}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>建筑特色</Text>
          <Text className={styles.sectionContent}>{tulouInfo.architecture}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>客家文化</Text>
          <Text className={styles.sectionContent}>{tulouInfo.culture}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>周边景点</Text>
          <View className={styles.attractionList}>
            {nearbyAttractions.map(attraction => (
              <View
                key={attraction.id}
                className={styles.attractionCard}
                onClick={() => handleAttractionClick(attraction)}
              >
                <Image
                  className={styles.attractionImage}
                  src={attraction.image}
                  mode="aspectFill"
                  onError={() => console.error('[TulouPage] 景点图片加载失败:', attraction.name)}
                />
                <View className={styles.attractionInfo}>
                  <Text className={styles.attractionName}>{attraction.name}</Text>
                  <Text className={styles.attractionDesc}>{attraction.description}</Text>
                  <View className={styles.attractionMeta}>
                    <View style={{ display: 'flex', gap: '16rpx' }}>
                      <Text className={styles.attractionMetaItem}>📍 {attraction.distance}</Text>
                      <Text className={styles.attractionMetaItem}>⏱️ {attraction.duration}</Text>
                    </View>
                    <Text className={styles.attractionPrice}>{attraction.ticketPrice}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TulouPage;
