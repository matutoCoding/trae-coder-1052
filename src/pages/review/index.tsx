import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow, useDidHide } from '@tarojs/taro';
import styles from './index.module.scss';
import { reviewList } from '@/data/reviews';
import { roomList } from '@/data/rooms';
import { formatDate, generateStars } from '@/utils';
import type { Review, Room } from '@/types';

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'good', label: '好评' },
  { key: 'medium', label: '中评' },
  { key: 'bad', label: '差评' },
  { key: 'withImage', label: '带图' },
  { key: 'noReply', label: '待回复' },
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
  { name: '服务热情', count: 42 },
  { name: '环境优美', count: 38 },
  { name: '干净整洁', count: 35 },
  { name: '交通便利', count: 28 },
  { name: '性价比高', count: 25 },
  { name: '设施齐全', count: 22 }
];

const sortOptions = [
  { key: 'date_desc', label: '最新', icon: '🕐' },
  { key: 'date_asc', label: '最早', icon: '🕑' },
  { key: 'rating_desc', label: '好评优先', icon: '⭐' },
  { key: 'rating_asc', label: '差评优先', icon: '💬' }
];

let globalRoomIdCache = '';
let globalFilterCache = 'all';
let globalSortCache = 'date_desc';

const ReviewPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.params?.roomId || '';
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(globalFilterCache);
  const [sortType, setSortType] = useState<string>(globalSortCache);
  const [displayCount, setDisplayCount] = useState(10);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const initialRoomId = roomId || globalRoomIdCache;
    globalRoomIdCache = initialRoomId;
    console.log('[ReviewPage] 页面加载，房间ID:', initialRoomId, '筛选:', globalFilterCache, '排序:', globalSortCache);
    loadData(initialRoomId);
  }, [roomId]);

  useDidShow(() => {
    console.log('[ReviewPage] useDidShow，使用缓存状态 - 房间:', globalRoomIdCache, '筛选:', globalFilterCache);
  });

  useDidHide(() => {
    globalFilterCache = activeFilter;
    globalSortCache = sortType;
    if (globalRoomIdCache || roomId) {
      globalRoomIdCache = roomId || globalRoomIdCache;
    }
    console.log('[ReviewPage] useDidHide，缓存状态');
  });

  const loadData = (targetRoomId?: string) => {
    setLoading(true);
    try {
      const safeRoomList = Array.isArray(roomList) ? roomList : [];
      const safeReviewList = Array.isArray(reviewList) ? reviewList : [];
      
      setTimeout(() => {
        let data = [...safeReviewList];
        const rid = targetRoomId || roomId;
        if (rid) {
          data = data.filter(r => r.roomId === rid);
          const foundRoom = safeRoomList.find(r => r.id === rid);
          setCurrentRoom(foundRoom || null);
          if (foundRoom) {
            Taro.setNavigationBarTitle({ title: foundRoom.name + ' - 评价' });
          }
        } else {
          setCurrentRoom(null);
        }
        setReviews(data);
        setLoading(false);
        console.log('[ReviewPage] 数据加载完成，共', data.length, '条评价');
      }, 300);
    } catch (error) {
      console.error('[ReviewPage] 数据加载失败:', error);
      setReviews([]);
      setCurrentRoom(null);
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
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
        result = result.filter(r => {
          const safeImages = Array.isArray(r.images) ? r.images : [];
          return safeImages.length > 0;
        });
        break;
      case 'noReply':
        result = result.filter(r => !r.reply);
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

    const now = Date.now();
    result.sort((a, b) => {
      switch (sortType) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating_desc':
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'rating_asc':
          if (a.rating !== b.rating) {
            return a.rating - b.rating;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });
    
    return result;
  }, [reviews, activeFilter, sortType]);

  const stats = useMemo(() => {
    const list = filteredReviews;
    if (list.length === 0) {
      return {
        average: 0,
        total: 0,
        good: 0,
        medium: 0,
        bad: 0,
        withImage: 0,
        replyRate: 0,
        noReply: 0,
        categories: {
          cleanliness: 0,
          service: 0,
          location: 0,
          facilities: 0
        }
      };
    }

    const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
    const good = list.filter(r => r.rating >= 4).length;
    const medium = list.filter(r => r.rating === 3).length;
    const bad = list.filter(r => r.rating <= 2).length;
    const withImage = list.filter(r => {
      const safeImages = Array.isArray(r.images) ? r.images : [];
      return safeImages.length > 0;
    }).length;
    const replied = list.filter(r => r.reply).length;
    const noReply = list.length - replied;

    return {
      average: Math.round(avg * 10) / 10,
      total: list.length,
      good,
      medium,
      bad,
      withImage,
      replyRate: list.length > 0 ? Math.round((replied / list.length) * 100) : 0,
      noReply,
      categories: {
        cleanliness: Math.round((avg * 1.05) * 10) / 10,
        service: Math.round((avg * 1.02) * 10) / 10,
        location: Math.round((avg * 0.98) * 10) / 10,
        facilities: Math.round((avg * 0.95) * 10) / 10
      }
    };
  }, [filteredReviews]);

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
    setDisplayCount(10);
    console.log('[ReviewPage] 筛选条件变更:', key, '筛选结果:', filteredReviews.length, '条');
  };

  const handleSortClick = (key: string) => {
    setSortType(key);
    setShowSortMenu(false);
    setDisplayCount(10);
    console.log('[ReviewPage] 排序方式变更:', key);
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

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 });
  };

  const currentSortLabel = useMemo(() => {
    const option = sortOptions.find(o => o.key === sortType);
    return option ? option.label : '最新';
  }, [sortType]);

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
      {currentRoom && (
        <View className={styles.roomHeader}>
          <View className={styles.backBtn} onClick={handleBack}>
            ←
          </View>
          <View className={styles.roomInfo}>
            <Text className={styles.roomName}>{currentRoom.name}</Text>
            <View className={styles.roomRating}>
              <Text className={styles.roomRatingValue}>{currentRoom.rating}</Text>
              <Text className={styles.roomStars}>{generateStars(currentRoom.rating)}</Text>
              <Text className={styles.roomReviewCount}>{currentRoom.reviewCount}条评价</Text>
            </View>
          </View>
          <Image className={styles.roomThumb} src={currentRoom.images[0]} mode="aspectFill" />
        </View>
      )}

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
          <View className={styles.summaryItem} onClick={() => handleFilterClick('good')}>
            <Text className={`${styles.summaryValue} ${activeFilter === 'good' ? styles.active : ''}`}>{stats.good}</Text>
            <Text className={styles.summaryLabel}>好评</Text>
          </View>
          <View className={styles.summaryItem} onClick={() => handleFilterClick('noReply')}>
            <Text className={`${styles.summaryValue} ${activeFilter === 'noReply' ? styles.active : ''}`}>{stats.noReply}</Text>
            <Text className={styles.summaryLabel}>待回复</Text>
          </View>
          <View className={styles.summaryItem} onClick={() => handleFilterClick('withImage')}>
            <Text className={`${styles.summaryValue} ${activeFilter === 'withImage' ? styles.active : ''}`}>{stats.withImage}</Text>
            <Text className={styles.summaryLabel}>带图</Text>
          </View>
        </View>

        <View className={styles.tagsRow}>
          {commonTags.map((tag, index) => (
            <View key={index} className={styles.tag}>
              {tag.name} ({tag.count})
            </View>
          ))}
        </View>

        <View className={styles.filterBar}>
          <ScrollView scrollX className={styles.filterScroll}>
            <View className={styles.filterTabs}>
              {filterOptions.map(option => (
                <View
                  key={option.key}
                  className={`${styles.filterTab} ${activeFilter === option.key ? styles.active : ''}`}
                  onClick={() => handleFilterClick(option.key)}
                >
                  {option.label}
                  {option.key === 'noReply' && stats.noReply > 0 && (
                    <Text className={styles.badge}>{stats.noReply}</Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
          <View className={styles.sortBtn} onClick={() => setShowSortMenu(!showSortMenu)}>
            <Text className={styles.sortIcon}>↕</Text>
            <Text className={styles.sortText}>{currentSortLabel}</Text>
          </View>
        </View>

        {showSortMenu && (
          <View className={styles.sortMenu}>
            {sortOptions.map(option => (
              <View
                key={option.key}
                className={`${styles.sortMenuItem} ${sortType === option.key ? styles.active : ''}`}
                onClick={() => handleSortClick(option.key)}
              >
                <Text>{option.icon} {option.label}</Text>
                {sortType === option.key && <Text className={styles.sortCheck}>✓</Text>}
              </View>
            ))}
          </View>
        )}
      </View>

      <ScrollView scrollY onScrollToLower={handleLoadMore} className={styles.listScroll}>
        <View className={styles.reviewList}>
          {displayReviews.length === 0 ? (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyText}>暂无评价</Text>
            </View>
          ) : (
            displayReviews.map(review => {
              const safeImages = Array.isArray(review.images) ? review.images.filter(img => img && typeof img === 'string') : [];
              const hasReply = !!review.reply;
              return (
                <View
                  key={review.id}
                  className={`${styles.reviewCard} ${hasReply ? styles.hasReply : ''}`}
                >
                  {hasReply && (
                    <View className={styles.replyBadge}>
                      <Text className={styles.replyBadgeText}>已回复</Text>
                    </View>
                  )}
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

                  {!review.reply && (
                    <View className={styles.noReplyHint}>
                      <Text className={styles.noReplyText}>📌 待回复评价</Text>
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

      {showSortMenu && (
        <View className={styles.sortMask} onClick={() => setShowSortMenu(false)} />
      )}
    </View>
  );
};

export default ReviewPage;
