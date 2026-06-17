import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { roomList } from '@/data/rooms';
import { formatPrice, formatDate, getWeekDay, calculateNights } from '@/utils';
import type { Room } from '@/types';

const BookingPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.params.roomId || '1';
  const checkIn = router.params.checkIn || '';
  const checkOut = router.params.checkOut || '';

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNo, setOrderNo] = useState('');

  useEffect(() => {
    console.log('[BookingPage] 页面加载，房间ID:', roomId, '入住:', checkIn, '退房:', checkOut);
    loadData();
  }, [roomId, checkIn, checkOut]);

  const loadData = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const foundRoom = roomList.find(r => r.id === roomId);
        if (foundRoom) {
          setRoom(foundRoom);
        }
        setLoading(false);
        console.log('[BookingPage] 数据加载完成');
      }, 300);
    } catch (error) {
      console.error('[BookingPage] 数据加载失败:', error);
      setLoading(false);
    }
  };

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!room) return 0;
    return room.price * nights;
  }, [room, nights]);

  const deposit = useMemo(() => {
    return Math.round(totalPrice * 0.3);
  }, [totalPrice]);

  const canSubmit = useMemo(() => {
    return room && guestName.trim() && phone.trim() && idCard.trim() && agreementChecked;
  }, [room, guestName, phone, idCard, agreementChecked]);

  const handleGuestChange = (delta: number) => {
    if (!room) return;
    const newValue = guestCount + delta;
    if (newValue >= 1 && newValue <= room.maxGuests) {
      setGuestCount(newValue);
      console.log('[BookingPage] 入住人数变更:', newValue);
    }
  };

  const validateForm = (): boolean => {
    if (!guestName.trim()) {
      Taro.showToast({ title: '请输入入住人姓名', icon: 'none' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号码', icon: 'none' });
      return false;
    }
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      Taro.showToast({ title: '请输入正确的身份证号码', icon: 'none' });
      return false;
    }
    if (!agreementChecked) {
      Taro.showToast({ title: '请同意预订条款', icon: 'none' });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    console.log('[BookingPage] 提交预订', {
      room: room?.name,
      checkIn,
      checkOut,
      nights,
      guestName,
      phone,
      idCard,
      guestCount,
      specialRequests,
      totalPrice,
      deposit
    });

    Taro.showLoading({ title: '提交中...' });
    
    setTimeout(() => {
      Taro.hideLoading();
      const newOrderNo = 'TL' + Date.now().toString().slice(-10);
      setOrderNo(newOrderNo);
      setShowSuccess(true);
      console.log('[BookingPage] 预订成功，订单号:', newOrderNo);
    }, 1500);
  };

  const handleViewOrder = () => {
    setShowSuccess(false);
    Taro.switchTab({ url: '/pages/mine/index' });
  };

  const handleBackHome = () => {
    setShowSuccess(false);
    Taro.switchTab({ url: '/pages/home/index' });
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
        <View className={styles.loading}>房间信息不存在</View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>预订信息</Text>
          
          <View className={styles.roomCard}>
            <Image className={styles.roomImage} src={room.images[0]} mode="aspectFill" />
            <View className={styles.roomInfo}>
              <View>
                <Text className={styles.roomName}>{room.name}</Text>
                <View className={styles.roomType}>{room.type}</View>
                <View className={styles.roomSpecs}>
                  <Text>🛏 {room.bedType}</Text>
                  <Text>📐 {room.area}㎡</Text>
                  <Text>👥 最多{room.maxGuests}人</Text>
                </View>
              </View>
              <View className={styles.priceRow}>
                <Text className={styles.price}>
                  <Text className={styles.currency}>¥</Text>{room.price}
                </Text>
                <Text className={styles.unit}>/晚</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>入住时间</Text>
          
          <View className={styles.dateRow}>
            <Text className={styles.dateLabel}>入住日期</Text>
            <Text className={styles.dateValue}>
              {formatDate(checkIn)}
              <Text className={styles.dateWeekday}>{getWeekDay(checkIn)}</Text>
            </Text>
            <Text className={styles.nightsInfo}>{nights}晚</Text>
          </View>
          
          <View className={styles.arrow}>↓</View>
          
          <View className={styles.dateRow}>
            <Text className={styles.dateLabel}>退房日期</Text>
            <Text className={styles.dateValue}>
              {formatDate(checkOut)}
              <Text className={styles.dateWeekday}>{getWeekDay(checkOut)}</Text>
            </Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>入住人信息</Text>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>入住人姓名
            </Text>
            <Input
              className={styles.formInput}
              placeholder="请输入入住人真实姓名"
              value={guestName}
              onInput={e => setGuestName(e.detail.value)}
              maxlength={20}
            />
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>手机号码
            </Text>
            <Input
              className={styles.formInput}
              placeholder="请输入手机号码"
              type="number"
              value={phone}
              onInput={e => setPhone(e.detail.value)}
              maxlength={11}
            />
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>身份证号码
            </Text>
            <Input
              className={styles.formInput}
              placeholder="请输入身份证号码"
              value={idCard}
              onInput={e => setIdCard(e.detail.value)}
              maxlength={18}
            />
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>入住人数</Text>
            <View className={styles.guestCountRow}>
              <Text className={styles.guestLabel}>{guestCount}人</Text>
              <View className={styles.guestControl}>
                <View
                  className={`${styles.guestBtn} ${guestCount <= 1 ? styles.disabled : ''}`}
                  onClick={() => guestCount > 1 && handleGuestChange(-1)}
                >
                  -
                </View>
                <Text className={styles.guestValue}>{guestCount}</Text>
                <View
                  className={`${styles.guestBtn} ${guestCount >= room.maxGuests ? styles.disabled : ''}`}
                  onClick={() => guestCount < room.maxGuests && handleGuestChange(1)}
                >
                  +
                </View>
              </View>
            </View>
          </View>
          
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>特殊要求（选填）</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="如有特殊需求请在此备注，如：高楼层、无烟房、需要婴儿床等"
              value={specialRequests}
              onInput={e => setSpecialRequests(e.detail.value)}
              maxlength={200}
            />
          </View>
          
          <View className={styles.policyNotice}>
            <Text className={styles.noticeIcon}>⚠️</Text>
            <Text className={styles.noticeText}>
              请确保入住人信息与身份证一致，入住时需出示有效身份证件。每位入住人均需提供有效身份证件登记。
            </Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>费用明细</Text>
          
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>房价</Text>
            <Text className={styles.summaryValue}>{formatPrice(room.price)} × {nights}晚</Text>
          </View>
          
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>房费小计</Text>
            <Text className={`${styles.summaryValue} ${styles.price}`}>{formatPrice(room.price * nights)}</Text>
          </View>
          
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>服务费</Text>
            <Text className={styles.summaryValue}>¥0</Text>
          </View>
          
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>税费</Text>
            <Text className={styles.summaryValue}>已包含</Text>
          </View>
          
          <View className={styles.divider} />
          
          <View className={styles.totalRow}>
            <Text className={styles.totalLabel}>应付总额</Text>
            <Text className={styles.totalValue}>
              <Text className={styles.currency}>¥</Text>{totalPrice}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.agreementRow}>
        <View
          className={`${styles.checkbox} ${agreementChecked ? styles.checked : ''}`}
          onClick={() => setAgreementChecked(!agreementChecked)}
        >
          {agreementChecked && '✓'}
        </View>
        <Text className={styles.agreementText}>
          我已阅读并同意
          <Text className={styles.link}> 《土楼民宿预订条款》</Text>
          和
          <Text className={styles.link}> 《退订政策》</Text>
          ，了解并同意相关预订规则和取消条款。
        </Text>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.totalInfo}>
          <Text className={styles.totalLabel}>应付总额</Text>
          <Text className={styles.totalPrice}>
            <Text className={styles.currency}>¥</Text>{totalPrice}
          </Text>
          <Text className={styles.depositInfo}>（需支付押金 {formatPrice(deposit)}，退房后退还）</Text>
        </View>
        <View
          className={`${styles.submitBtn} ${!canSubmit ? styles.disabled : ''}`}
          onClick={canSubmit ? handleSubmit : undefined}
        >
          确认预订
        </View>
      </View>

      {showSuccess && (
        <View className={styles.successModal}>
          <View className={styles.modalContent}>
            <View className={styles.successIcon}>✓</View>
            <Text className={styles.successTitle}>预订成功！</Text>
            <Text className={styles.successMsg}>
              您的订单已提交成功，我们将在30分钟内确认订单状态。确认后将发送短信通知。
            </Text>
            <View className={styles.orderNo}>订单号：{orderNo}</View>
            <View className={styles.modalBtns}>
              <View className={`${styles.modalBtn} ${styles.secondary}`} onClick={handleBackHome}>
                返回首页
              </View>
              <View className={`${styles.modalBtn} ${styles.primary}`} onClick={handleViewOrder}>
                查看订单
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BookingPage;
