import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { bookingList, refundList } from '@/data/reviews';
import type { Booking, RefundRecord } from '@/types';
import { formatPrice, getStatusText, formatDate, calculateNights } from '@/utils';

const refundReasons = [
  '行程临时变更',
  '身体不适',
  '天气原因',
  '找到更合适的住宿',
  '其他原因'
];

const RefundPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [activeTab, setActiveTab] = useState<'booking' | 'record'>('booking');

  useEffect(() => {
    console.log('[RefundPage] 页面加载');
    loadData();
  }, []);

  const loadData = () => {
    const eligibleBookings = bookingList.filter(
      b => b.status === 'confirmed' || b.status === 'pending' || b.status === 'checkedIn'
    );
    setBookings(eligibleBookings);
    setRefunds(refundList);
    console.log('[RefundPage] 数据加载完成:', eligibleBookings.length, refundList.length);
  };

  const handleApplyRefund = (booking: Booking) => {
    console.log('[RefundPage] 申请退订:', booking.id);
    setSelectedBooking(booking);
    setSelectedReason('');
    setShowApplyModal(true);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const calculateRefundAmount = (booking: Booking) => {
    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    const daysDiff = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let refundRate = 0;
    if (daysDiff >= 7) refundRate = 1;
    else if (daysDiff >= 3) refundRate = 0.8;
    else if (daysDiff >= 1) refundRate = 0.5;
    else refundRate = 0;
    
    return Math.round(booking.totalPrice * refundRate);
  };

  const handleConfirmRefund = () => {
    if (!selectedBooking) return;
    if (!selectedReason) {
      Taro.showToast({ title: '请选择退订原因', icon: 'none' });
      return;
    }
    
    const refundAmount = calculateRefundAmount(selectedBooking);
    
    if (refundAmount === 0) {
      Taro.showModal({
        title: '温馨提示',
        content: '根据退订政策，入住前24小时内退订将不予退款。是否继续申请？',
        success: (res) => {
          if (res.confirm) {
            submitRefund(refundAmount);
          }
        }
      });
    } else {
      submitRefund(refundAmount);
    }
  };

  const submitRefund = (amount: number) => {
    console.log('[RefundPage] 提交退订申请:', {
      bookingId: selectedBooking?.id,
      reason: selectedReason,
      amount
    });
    
    Taro.showToast({
      title: '申请已提交',
      icon: 'success'
    });
    setShowApplyModal(false);
    
    if (selectedBooking) {
      const newRefund: RefundRecord = {
        id: `RF${Date.now()}`,
        bookingId: selectedBooking.id,
        reason: selectedReason,
        amount,
        status: 'pending',
        applyTime: new Date().toLocaleString('zh-CN')
      };
      setRefunds(prev => [newRefund, ...prev]);
      setBookings(prev => prev.filter(b => b.id !== selectedBooking.id));
    }
  };

  const canRefund = (booking: Booking) => {
    return booking.status === 'confirmed' || booking.status === 'pending';
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.policyCard}>
          <Text className={styles.policyTitle}>📋 退订政策</Text>
          <View className={styles.policyContent}>
            <Text className={styles.policyItem}>入住前7天及以上退订：全额退款</Text>
            <Text className={styles.policyItem}>入住前3-7天退订：退款80%</Text>
            <Text className={styles.policyItem}>入住前1-3天退订：退款50%</Text>
            <Text className={styles.policyItem}>入住前24小时内退订：不予退款</Text>
            <Text className={styles.policyItem}>活动类产品退订需提前48小时</Text>
          </View>
        </View>

        <View style={{ display: 'flex', gap: '16rpx', marginBottom: '24rpx' }}>
          <View
            className={classnames(styles.reasonOption, activeTab === 'booking' && styles.active)}
            style={{ flex: 1, textAlign: 'center' }}
            onClick={() => setActiveTab('booking')}
          >
            可退订订单
          </View>
          <View
            className={classnames(styles.reasonOption, activeTab === 'record' && styles.active)}
            style={{ flex: 1, textAlign: 'center' }}
            onClick={() => setActiveTab('record')}
          >
            退订记录
          </View>
        </View>

        {activeTab === 'booking' ? (
          <>
            <Text className={styles.sectionTitle}>可退订订单</Text>
            {bookings.length > 0 ? (
              <View className={styles.bookingList}>
                {bookings.map(booking => (
                  <View key={booking.id} className={styles.bookingCard}>
                    <View className={styles.bookingHeader}>
                      <Text className={styles.bookingRoom}>{booking.roomName}</Text>
                      <Text className={classnames(styles.bookingStatus, booking.status)}>
                        {getStatusText(booking.status)}
                      </Text>
                    </View>
                    <View className={styles.bookingInfo}>
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>入住日期</Text>
                        <Text className={styles.infoValue}>{formatDate(booking.checkIn)}</Text>
                      </View>
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>退房日期</Text>
                        <Text className={styles.infoValue}>{formatDate(booking.checkOut)}</Text>
                      </View>
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>入住人</Text>
                        <Text className={styles.infoValue}>{booking.guestName}</Text>
                      </View>
                    </View>
                    <View className={styles.bookingPrice}>
                      <Text className={styles.priceText}>{formatPrice(booking.totalPrice)}</Text>
                      <View
                        className={classnames(styles.refundBtn, !canRefund(booking) && styles.disabled)}
                        onClick={() => canRefund(booking) && handleApplyRefund(booking)}
                      >
                        {canRefund(booking) ? '申请退订' : '已入住'}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.empty}>
                <Text className={styles.icon}>📭</Text>
                <Text className={styles.text}>暂无可退订订单</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text className={styles.sectionTitle}>退订记录</Text>
            {refunds.length > 0 ? (
              <View className={styles.refundList}>
                {refunds.map(refund => (
                  <View key={refund.id} className={styles.refundCard}>
                    <View className={styles.refundHeader}>
                      <Text className={styles.refundId}>订单号：{refund.bookingId}</Text>
                      <Text className={classnames(styles.refundStatus, refund.status)}>
                        {getStatusText(refund.status)}
                      </Text>
                    </View>
                    <View className={styles.refundInfo}>
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>退订原因</Text>
                        <Text className={styles.infoValue}>{refund.reason}</Text>
                      </View>
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>申请时间</Text>
                        <Text className={styles.infoValue}>{refund.applyTime}</Text>
                      </View>
                      {refund.processTime && (
                        <View className={styles.infoRow}>
                          <Text className={styles.infoLabel}>处理时间</Text>
                          <Text className={styles.infoValue}>{refund.processTime}</Text>
                        </View>
                      )}
                      {refund.refundTime && (
                        <View className={styles.infoRow}>
                          <Text className={styles.infoLabel}>退款到账</Text>
                          <Text className={styles.infoValue}>{refund.refundTime}</Text>
                        </View>
                      )}
                    </View>
                    <View className={styles.refundAmount}>
                      <Text className={styles.infoLabel}>退款金额</Text>
                      <Text className={styles.amountText}>{formatPrice(refund.amount)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.empty}>
                <Text className={styles.icon}>📋</Text>
                <Text className={styles.text}>暂无退订记录</Text>
              </View>
            )}
          </>
        )}
      </View>

      {showApplyModal && selectedBooking && (
        <View className={styles.applyModal} onClick={() => setShowApplyModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>申请退订</Text>
              <Text className={styles.closeBtn} onClick={() => setShowApplyModal(false)}>×</Text>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>退订原因</Text>
              <View className={styles.reasonOptions}>
                {refundReasons.map(reason => (
                  <View
                    key={reason}
                    className={classnames(styles.reasonOption, selectedReason === reason && styles.active)}
                    onClick={() => handleReasonSelect(reason)}
                  >
                    {reason}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>退款信息</Text>
              <View className={styles.refundInfoBox}>
                <View className={styles.refundRow}>
                  <Text className={styles.refundRowLabel}>订单金额</Text>
                  <Text className={styles.refundRowValue}>{formatPrice(selectedBooking.totalPrice)}</Text>
                </View>
                <View className={styles.refundRow}>
                  <Text className={styles.refundRowLabel}>已付定金</Text>
                  <Text className={styles.refundRowValue}>{formatPrice(selectedBooking.deposit)}</Text>
                </View>
                <View className={styles.refundRow}>
                  <Text className={styles.refundRowLabel}>入住日期</Text>
                  <Text className={styles.refundRowValue}>{formatDate(selectedBooking.checkIn)}</Text>
                </View>
                <View className={styles.refundRow}>
                  <Text className={styles.refundRowLabel}>预计退款</Text>
                  <Text className={classnames(styles.refundRowValue, styles.refund)}>
                    {formatPrice(calculateRefundAmount(selectedBooking))}
                  </Text>
                </View>
              </View>
            </View>

            <View className={styles.confirmBtn} onClick={handleConfirmRefund}>
              确认申请退订
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default RefundPage;
