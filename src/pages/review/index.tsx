import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { reviewList } from '@/data/reviews';
import { roomList } from '@/data/rooms';
import { formatDate, generateStars } from '@/utils';
import type { Review } from '@/types';

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'good', label: '好评 (4-5分)' },
  { key: 'medium', label: '中评 (3分)' },
  { key: 'bad', label: '差评 (1-2分)' },
  { key: 'withImage', label: '带图' },
  { key: 'room', label: '房间' },
  { key: 'activity', label: '活动' },
  { key: 'dining', label: '餐饮' }
];

const ratingCategories = [
  { key: 'cleanliness', label: '卫生清洁' },
  { key: 'service', label: '服务态度' },
  { key: 'location', label: '位置交通' },
  { key: 'facilities', label: '设施设备' }
];

const typeLabels: Record<string, string> = {
  room: '房间评价',
  activity: '活动评价',
  dining: '餐饮评价'
};

const commonTags = [
  '服务热情', '环境优美', '干净整洁', '交通便利',
  '性价比高', '设施齐全', '风景好', '体验棒',
  '美食好吃', '亲子适合', '文化氛围', '隔音好'
];

const ReviewPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.params?.roomId || '';
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    console.log('[ReviewPage] 页面加载，房间ID:', roomId);
    loadData();
  }, [roomId]);

  const loadData = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const safeReviewList = Array.isArray(reviewList) ? reviewList : [];
        let data = [...safeReviewList];
        if (roomId) {
          data = data.filter(r => r.roomId === roomId);
        }
        setReviews(data);
        setFilteredReviews(data);
        setLoading(false);
        console.log('[ReviewPage] 数据加载完成，共', data.length, '条评价');
      }, 300);
    } catch (error) {
      console.error('[ReviewPage] 数据加载失败:', error);
      setReviews([]);
      setFilteredReviews([]);
      setLoading(false);
    }
  };



  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        good: 0,
        medium: 0,
        bad: 0,
        withImage: 0,
        replyRate: 0,
        categories: {
          cleanliness: 0,
          service: 0,
          location: 0,
          facilities: 0
        }
      };
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const good = reviews.filter(r => r.rating >= 4).length;
    const medium = reviews.filter(r => r.rating === 3).length;
    const bad = reviews.filter(r => r.rating <= 2).length;
    const withImage = reviews.filter(r => r.images.length > 0).length;
    const replied = reviews.filter(r => r.reply).length;

    return {
      average: Math.round(avg * 10) / 10,
      total: reviews.length,
      good,
      medium,
      bad,
      withImage,
      replyRate: Math.round((replied / reviews.length) * 100),
      categories: {
        cleanliness: Math.round((avg * 1.05) * 10) / 10,
        service: Math.round((avg * 1.02) * 10) / 10,
        location: Math.round((avg * 0.98) * 10) / 10,
        facilities: Math.round((avg * 0.95) * 10) / 10
      }
    };
  }, [reviews]);

  useEffect(() => {
    let result = [...reviews];
    
    switch (activeFilter) {
      case 'good':
        result = result.filter(r => r.rating >= 4);
        break;
      case 'medium':
        result = result.filter(r => r.rating === 3);
        break;
      case 'bad':
        result = result.filter(r => r.rating <= 2);
        break;
      case 'withImage':
        result = result.filter(r => r.images.length > 0);
        break;
      case 'room':
        result = result.filter(r => r.type === 'room');
        break;
      case 'activity':
        result = result.filter(r => r.type === 'activity');
        break;
      case 'dining':
        result = result.filter(r => r.type === 'dining');
        break;
    }
    
    setFilteredReviews(result);
    setDisplayCount(10);
    console.log('[ReviewPage] 筛选条件变更:', activeFilter, '筛选结果:', result.length, '条');
  }, [activeFilter, reviews]);

  const getRoomName = (id?: string) => {
    if (!id) return '';
    try {
      const safeRoomList = Array.isArray(roomList) ? roomList : [];
      const room = safeRoomList.find(r => r.id === id);
      return room ? room.name : '';
    } catch (error) {
      console.error('[ReviewPage] 获取房间名称失败:', error);
      return '';
    }
  };

  const handleFilterClick = (key: string) => {
    setActiveFilter(key);
  };

  const handleLoadMore = () => {
    if (displayCount < filteredReviews.length) {
      setDisplayCount(prev => prev + 10);
      console.log('[ReviewPage] 加载更多，当前显示:', Math.min(displayCount + 10, filteredReviews.length), '条');
    }
  };

  const handleImagePreview = (images: string[], current: string) => {
    try {
      console.log('[ReviewPage] 预览图片:', current);
      const safeImages = Array.isArray(images) ? images.filter(img => img && typeof img === 'string') : [];
      if (safeImages.length === 0) {
        Taro.showToast({ title: '图片加载失败', icon: 'none' });
        return;
      }
      Taro.previewImage({
        urls: safeImages,
        current: current || safeImages[0]
      });
    } catch (error) {
      console.error('[ReviewPage] 预览图片失败:', error);
      Taro.showToast({ title: '预览失败', icon: 'none' });
    }
  };

  const displayReviews = useMemo(() => {
    return filteredReviews.slice(0, displayCount);
  }, [filteredReviews, displayCount]);

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.loading}>加载中...</View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.overallRating}>
          <View className={styles.ratingLeft}>
            <Text className={styles.ratingValue}>{stats.average}</Text>
            <View className={styles.ratingStars}>{generateStars(stats.average)}</View>
            <Text className={styles.ratingCount}>{stats.total}条评价</Text>
          </View>
          <View className={styles.ratingRight}>
            {ratingCategories.map(cat => (
              <View key={cat.key} className={styles.ratingItem}>
                <Text className={styles.ratingLabel}>{cat.label}</Text>
                <View className={styles.ratingBar}>
                  <View
                    className={styles.ratingFill}
                    style={{ width: `${(stats.categories[cat.key as keyof typeof stats.categories] / 5) * 100}%` }}
                  />
                </View>
                <Text className={styles.ratingScore}>{stats.categories[cat.key as keyof typeof stats.categories]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{stats.good}</Text>
            <Text className={styles.summaryLabel}>好评</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{stats.replyRate}%</Text>
            <Text className={styles.summaryLabel}>回复率</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{stats.withImage}</Text>
            <Text className={styles.summaryLabel}>带图</Text>
          </View>
        </View>

        <View className={styles.tagsRow}>
          {commonTags.slice(0, 6).map((tag, index) => (
            <View key={index} className={styles.tag}>
              {tag} ({Math.floor(Math.random() * 50) + 10})
            </View>
          ))}
        </View>

        <View className={styles.filterTabs}>
          {filterOptions.map(option => (
            <View
              key={option.key}
              className={`${styles.filterTab} ${activeFilter === option.key ? styles.active : ''}`}
              onClick={() => handleFilterClick(option.key)}
            >
              {option.label}
            </View>
          ))}
        </View>
      </View>

      <ScrollView scrollY onScrollToLower={handleLoadMore}>
        <View className={styles.reviewList}>
          {displayReviews.length === 0 ? (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyText}>暂无评价</Text>
            </View>
          ) : (
            displayReviews.map(review => {
              const safeImages = Array.isArray(review.images) ? review.images.filter(img => img && typeof img === 'string') : [];
              return (
                <View key={review.id} className={styles.reviewCard}>
                  <View className={styles.reviewHeader}>
                    <Image 
                      className={styles.avatar} 
                      src={review.avatar || 'https://picsum.photos/id/64/200/200'} 
                      mode="aspectFill" 
                    />
                    <View className={styles.reviewerInfo}>
                      <Text className={styles.reviewerName}>{review.userName || '匿名用户'}</Text>
                      <View className={styles.reviewMeta}>
                        <Text className={styles.reviewStars}>{generateStars(review.rating || 0)}</Text>
                        <Text className={styles.reviewDate}>{review.date ? formatDate(review.date) : ''}</Text>
                        <View className={styles.reviewType}>{typeLabels[review.type] || '评价'}</View>
                      </View>
                    </View>
                  </View>

                  <Text className={styles.reviewContent}>{review.content || ''}</Text>

                  {safeImages.length > 0 && (
                    <View className={styles.reviewImages}>
                      {safeImages.map((img, index) => (
                        <Image
                          key={index}
                          className={styles.reviewImage}
                          src={img}
                          mode="aspectFill"
                          onClick={() => handleImagePreview(safeImages, img)}
                        />
                      ))}
                    </View>
                  )}

                  {review.roomId && (
                    <View className={styles.reviewRoom}>
                      入住房型：{getRoomName(review.roomId)}
                    </View>
                  )}

                  {review.reply && (
                    <View className={styles.replySection}>
                      <View className={styles.replyHeader}>
                        <Text className={styles.replyIcon}>💬</Text>
                        <Text className={styles.replyLabel}>店家回复</Text>
                      </View>
                      <Text className={styles.replyContent}>{review.reply}</Text>
                      <Text className={styles.replyDate}>{review.date ? formatDate(review.date) : ''} 回复</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}

          {displayCount < filteredReviews.length && (
            <View className={styles.loadMore} onClick={handleLoadMore}>
              加载更多 →
            </View>
          )}

          {displayCount >= filteredReviews.length && filteredReviews.length > 0 && (
            <View className={styles.noMore}>
              — 没有更多评价了 —
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewPage;
