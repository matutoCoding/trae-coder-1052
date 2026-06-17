import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { roomList, generateCalendarData } from '@/data/rooms';
import { reviewList } from '@/data/reviews';
import { formatPrice, formatDate, getStatusText, getStatusColor, calculateNights, generateStars } from '@/utils';
import type { Room, RoomCalendar, Review } from '@/types';

const facilityIcons: Record<string, string> = {
  '独立卫浴': '🚿',
  '空调': '❄️',
  'WiFi': '📶',
  '电视': '📺',
  '茶台': '🍵',
  '观景窗': '🪟',
  '衣柜': '👕',
  '儿童用品': '👶',
  '公共卫浴': '🚻',
  '观景阳台': '🌅',
  '迷你吧': '🍷',
  '智能电视': '📱'
};

const RoomDetailPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.params.id || '1';
  
  const [room, setRoom] = useState<Room | null>(null);
  const [calendarData, setCalendarData] = useState<RoomCalendar[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    console.log('[RoomDetailPage] 页面加载，房间ID:', roomId);
    loadData();
  }, [roomId]);

  const loadData = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const safeRoomList = Array.isArray(roomList) ? roomList : [];
        const foundRoom = safeRoomList.find(r => r.id === roomId);
        if (foundRoom) {
          setRoom(foundRoom);
          try {
            const calendar = generateCalendarData(roomId);
            setCalendarData(Array.isArray(calendar) ? calendar : []);
          } catch (e) {
            console.error('[RoomDetailPage] 日历数据加载失败:', e);
            setCalendarData([]);
          }
          const safeReviewList = Array.isArray(reviewList) ? reviewList : [];
          setReviews(safeReviewList.filter(r => r.roomId === roomId || r.type === 'room').slice(0, 3));
          
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          setCheckInDate(today.toISOString().split('T')[0]);
          setCheckOutDate(tomorrow.toISOString().split('T')[0]);
          
          const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
          setCurrentMonth(monthNames[today.getMonth()] + ' ' + today.getFullYear());
        }
        setLoading(false);
        console.log('[RoomDetailPage] 数据加载完成');
      }, 300);
    } catch (error) {
      console.error('[RoomDetailPage] 数据加载失败:', error);
      setRoom(null);
      setCalendarData([]);
      setReviews([]);
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const days: (RoomCalendar | null)[] = [];
    const firstDay = new Date(calendarData[0]?.date || new Date()).getDay();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    calendarData.forEach(d => days.push(d));
    return days;
  }, [calendarData]);

  const totalPrice = useMemo(() => {
    if (!checkInDate || !checkOutDate || !room) return 0;
    const nights = calculateNights(checkInDate, checkOutDate);
    return room.price * nights;
  }, [checkInDate, checkOutDate, room]);

  const handleDateClick = (date: string, status: string) => {
    if (status === 'booked') {
      Taro.showToast({ title: '该日期已被预订', icon: 'none' });
      return;
    }
    
    console.log('[RoomDetailPage] 选择日期:', date, '状态:', status);
    
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate('');
    } else {
      if (new Date(date) <= new Date(checkInDate)) {
        setCheckInDate(date);
        setCheckOutDate('');
      } else {
        const hasBookedInRange = calendarData.some(d => {
          const dDate = new Date(d.date);
          return dDate > new Date(checkInDate) && dDate < new Date(date) && d.status === 'booked';
        });
        
        if (hasBookedInRange) {
          Taro.showToast({ title: '所选日期范围存在已预订日期', icon: 'none' });
          return;
        }
        setCheckOutDate(date);
      }
    }
  };

  const isInRange = (date: string) => {
    if (!checkInDate || !checkOutDate) return false;
    const d = new Date(date);
    return d > new Date(checkInDate) && d < new Date(checkOutDate);
  };

  const isSelected = (date: string) => {
    return date === checkInDate || date === checkOutDate;
  };

  const handleBook = () => {
    if (!checkInDate || !checkOutDate) {
      Taro.showToast({ title: '请选择入住和退房日期', icon: 'none' });
      return;
    }
    if (!room) return;
    
    console.log('[RoomDetailPage] 点击预订，房间:', room.name, '入住:', checkInDate, '退房:', checkOutDate);
    
    Taro.navigateTo({
      url: `/pages/booking/index?roomId=${room.id}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
    });
  };

  const handleViewReviews = () => {
    Taro.navigateTo({ url: `/pages/review/index?roomId=${roomId}` });
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.loading}>加载中...</View>
      </View>
    );
  }

  if (!room) {
    return (
      <View className={styles.page}>
        <View className={styles.loading}>房间不存在</View>
      </View>
    );
  }

  const discount = Math.round((1 - room.price / room.originalPrice) * 100);

  return (
    <View className={styles.page}>
      <View className={styles.banner}>
        <View className={styles.badge}>{discount}% OFF</View>
        <Swiper autoplay circular indicatorDots indicatorColor="rgba(255,255,255,0.5)" indicatorActiveColor="#ffffff">
          {room.images.map((img, index) => (
            <SwiperItem key={index}>
              <Image className={styles.bannerImage} src={img} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.header}>
            <View className={styles.titleRow}>
              <Text className={styles.title}>{room.name}</Text>
              <View className={`${styles.statusTag} ${styles[room.status]}`}>
                {getStatusText(room.status)}
              </View>
            </View>
            
            <View className={styles.subInfo}>
              <View className={styles.typeTag}>{room.type}</View>
              <View className={styles.infoItem}>🛏 {room.bedType}</View>
              <View className={styles.infoItem}>📐 {room.area}㎡</View>
              <View className={styles.infoItem}>🏢 {room.floor}</View>
              <View className={styles.infoItem}>👥 最多{room.maxGuests}人</View>
            </View>
            
            <View className={styles.ratingRow}>
              <Text className={styles.rating}>{room.rating}</Text>
              <Text className={styles.stars}>{generateStars(room.rating)}</Text>
              <Text className={styles.reviewCount}>{room.reviewCount}条评价</Text>
            </View>
            
            <View className={styles.priceRow}>
              <Text className={styles.price}>
                <Text className={styles.currency}>¥</Text>{room.price}
              </Text>
              <Text className={styles.originalPrice}>¥{room.originalPrice}</Text>
              <Text className={styles.unit}>/晚</Text>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>房间介绍</Text>
            <Text className={styles.description}>{room.description}</Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>房间设施</Text>
            <View className={styles.facilityGrid}>
              {room.facilities.map((facility, index) => (
                <View key={index} className={styles.facilityItem}>
                  <View className={styles.facilityIcon}>
                    {facilityIcons[facility] || '✅'}
                  </View>
                  <Text className={styles.facilityName}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={`${styles.section} ${styles.calendarSection}`}>
            <Text className={styles.sectionTitle}>选择日期</Text>
            
            <View className={styles.calendarHeader}>
              <Text className={styles.monthLabel}>{currentMonth}</Text>
              <View className={styles.legend}>
                <View className={styles.legendItem}>
                  <View className={styles.legendDot} style={{ background: getStatusColor('available') }} />
                  <Text>可订</Text>
                </View>
                <View className={styles.legendItem}>
                  <View className={styles.legendDot} style={{ background: getStatusColor('booked') }} />
                  <Text>已订</Text>
                </View>
                <View className={styles.legendItem}>
                  <View className={styles.legendDot} style={{ background: getStatusColor('pending') }} />
                  <Text>待确认</Text>
                </View>
              </View>
            </View>
            
            <View className={styles.weekRow}>
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <Text key={day} className={styles.weekDay}>{day}</Text>
              ))}
            </View>
            
            <View className={styles.dateGrid}>
              {calendarDays.map((day, index) => (
                day ? (
                  <View
                    key={index}
                    className={`${styles.dateCell} ${styles[day.status]} ${isSelected(day.date) ? styles.selected : ''} ${isInRange(day.date) ? styles.range : ''}`}
                    onClick={() => handleDateClick(day.date, day.status)}
                  >
                    <Text className={styles.dateDay}>{new Date(day.date).getDate()}</Text>
                    <Text className={styles.datePrice}>¥{day.price}</Text>
                  </View>
                ) : (
                  <View key={index} className={`${styles.dateCell} ${styles.empty}`} />
                )
              ))}
            </View>
          </View>

          <View className={`${styles.section} ${styles.policySection}`}>
            <Text className={styles.sectionTitle}>预订政策</Text>
            
            <View className={styles.policyItem}>
              <View className={styles.policyIcon}>⏰</View>
              <View className={styles.policyContent}>
                <Text className={styles.policyTitle}>入住时间</Text>
                <Text className={styles.policyDesc}>14:00 后可办理入住，早到可能需要等待</Text>
              </View>
            </View>
            
            <View className={styles.policyItem}>
              <View className={styles.policyIcon}>🚪</View>
              <View className={styles.policyContent}>
                <Text className={styles.policyTitle}>退房时间</Text>
                <Text className={styles.policyDesc}>12:00 前需办理退房，延迟退房需加收费用</Text>
              </View>
            </View>
            
            <View className={styles.policyItem}>
              <View className={styles.policyIcon}>↩️</View>
              <View className={styles.policyContent}>
                <Text className={styles.policyTitle}>取消政策</Text>
                <Text className={styles.policyDesc}>入住前7天以上取消全额退款，3-7天退款80%，1-3天退款50%，24小时内不予退款</Text>
              </View>
            </View>
            
            <View className={styles.policyItem}>
              <View className={styles.policyIcon}>👶</View>
              <View className={styles.policyContent}>
                <Text className={styles.policyTitle}>儿童政策</Text>
                <Text className={styles.policyDesc}>欢迎携带儿童入住，6岁以下儿童免费，6-12岁儿童加收50%房费</Text>
              </View>
            </View>
          </View>

          {reviews.length > 0 && (
            <View className={styles.section}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Text className={styles.sectionTitle}>用户评价</Text>
                <Text style={{ fontSize: 24, color: '#C4956A' }} onClick={handleViewReviews}>查看全部 →</Text>
              </View>
              
              {reviews.map(review => (
                <View key={review.id} style={{ padding: 24, background: '#FAF7F2', borderRadius: 16, marginBottom: 16 }}>
                  <View style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <Image src={review.avatar} style={{ width: 64, height: 64, borderRadius: 32 }} />
                    <View>
                      <Text style={{ fontSize: 28, fontWeight: 600, color: '#3D2E1F' }}>{review.userName}</Text>
                      <View style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Text style={{ fontSize: 24, color: '#E8A33D' }}>{generateStars(review.rating)}</Text>
                        <Text style={{ fontSize: 22, color: '#9C8B7D' }}>{formatDate(review.date)}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={{ fontSize: 26, color: '#6B5B4F', lineHeight: 1.6 }}>{review.content}</Text>
                  {review.reply && (
                    <View style={{ marginTop: 12, padding: 16, background: '#F5EDE0', borderRadius: 12 }}>
                      <Text style={{ fontSize: 24, color: '#5D7A6B', fontWeight: 500 }}>店家回复：</Text>
                      <Text style={{ fontSize: 24, color: '#6B5B4F', marginTop: 4 }}>{review.reply}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.selectedInfo}>
          {checkInDate && checkOutDate ? (
            <>
              <Text className={styles.selectedLabel}>已选择</Text>
              <Text className={styles.selectedDates}>
                {formatDate(checkInDate)} - {formatDate(checkOutDate)} ({calculateNights(checkInDate, checkOutDate)}晚)
              </Text>
              <Text className={styles.totalPrice}>共 {formatPrice(totalPrice)}</Text>
            </>
          ) : (
            <>
              <Text className={styles.selectedLabel}>请选择日期</Text>
              <Text className={styles.selectedDates}>选择入住和退房日期</Text>
            </>
          )}
        </View>
        <View
          className={`${styles.bookBtn} ${room.status !== 'available' || !checkInDate || !checkOutDate ? styles.disabled : ''}`}
          onClick={room.status === 'available' && checkInDate && checkOutDate ? handleBook : undefined}
        >
          {room.status === 'available' ? '立即预订' : getStatusText(room.status)}
        </View>
      </View>
    </View>
  );
};

export default RoomDetailPage;
