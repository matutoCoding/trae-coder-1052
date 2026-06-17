import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { dishList, dishCategories, timeSlots, diningPackages } from '@/data/dining';
import type { Dish } from '@/types';
import { formatPrice } from '@/utils';

const DiningPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);

  useEffect(() => {
    console.log('[DiningPage] 页面加载');
    filterDishes();
  }, [activeCategory]);

  const filterDishes = () => {
    let filtered = dishList;
    if (activeCategory !== 'all') {
      filtered = dishList.filter(d => d.category === activeCategory);
    }
    setDishes(filtered);
  };

  const handleCategoryChange = (category: string) => {
    console.log('[DiningPage] 切换分类:', category);
    setActiveCategory(category);
  };

  const handleQuantityChange = (dishId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[dishId] || 0;
      const newValue = Math.max(0, current + delta);
      console.log('[DiningPage] 更新菜品数量:', dishId, newValue);
      return { ...prev, [dishId]: newValue };
    });
  };

  const getTotalPrice = () => {
    return Object.entries(quantities).reduce((total, [dishId, qty]) => {
      const dish = dishList.find(d => d.id === dishId);
      return total + (dish?.price || 0) * qty;
    }, 0);
  };

  const getTotalCount = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleBook = () => {
    console.log('[DiningPage] 点击预订按钮');
    setShowBookingModal(true);
  };

  const handleDateChange = (e: { detail: { value: string } }) => {
    console.log('[DiningPage] 选择日期:', e.detail.value);
    setSelectedDate(e.detail.value);
  };

  const handleTimeSelect = (time: string) => {
    console.log('[DiningPage] 选择时间:', time);
    setSelectedTime(time);
  };

  const handleGuestChange = (delta: number) => {
    setGuestCount(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleConfirmBooking = () => {
    if (!selectedDate) {
      Taro.showToast({ title: '请选择用餐日期', icon: 'none' });
      return;
    }
    if (!selectedTime) {
      Taro.showToast({ title: '请选择用餐时间', icon: 'none' });
      return;
    }
    
    const totalPrice = getTotalPrice();
    console.log('[DiningPage] 确认预订:', {
      date: selectedDate,
      time: selectedTime,
      guests: guestCount,
      totalPrice
    });
    
    Taro.showModal({
      title: '确认预订',
      content: `用餐日期：${selectedDate}\n用餐时间：${selectedTime}\n用餐人数：${guestCount}人\n菜品总价：${formatPrice(totalPrice)}`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '预订成功！',
            icon: 'success'
          });
          setShowBookingModal(false);
          setQuantities({});
        }
      }
    });
  };

  const handlePackageSelect = (pkg: typeof diningPackages[0]) => {
    console.log('[DiningPage] 选择套餐:', pkg.name);
    Taro.showToast({
      title: `已选择${pkg.name}`,
      icon: 'success'
    });
  };

  const getSpicyText = (level: number) => {
    if (level === 0) return '不辣';
    if (level === 1) return '微辣';
    if (level === 2) return '中辣';
    return '特辣';
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View className={styles.page}>
      <ScrollView scrollY enhanced>
        <View className={styles.content}>
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>特色套餐</Text>
            <View className={styles.packageList}>
              {diningPackages.map(pkg => (
                <View
                  key={pkg.id}
                  className={styles.packageCard}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  <View className={styles.packageHeader}>
                    <View>
                      <Text className={styles.packageName}>{pkg.name}</Text>
                      <Text className={styles.packageSuitable}>适合{pkg.suitable}用餐</Text>
                    </View>
                    <View className={styles.packagePrice}>
                      <Text className={styles.packageCurrentPrice}>{formatPrice(pkg.price)}</Text>
                      <Text className={styles.packageOriginalPrice}>{formatPrice(pkg.originalPrice)}</Text>
                    </View>
                  </View>
                  <Text className={styles.packageDishes}>
                    {pkg.dishes.join('、')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>菜品选择</Text>
            
            <ScrollView
              className={styles.categoryTabs}
              scrollX
              enhanced
              showScrollbar={false}
            >
              {dishCategories.map(cat => (
                <View
                  key={cat.key}
                  className={classnames(styles.categoryTab, activeCategory === cat.key && styles.active)}
                  onClick={() => handleCategoryChange(cat.key)}
                >
                  {cat.label}
                </View>
              ))}
            </ScrollView>

            <View className={styles.dishList}>
              {dishes.map(dish => (
                <View key={dish.id} className={styles.dishCard}>
                  <Image
                    className={styles.dishImage}
                    src={dish.image}
                    mode="aspectFill"
                    onError={() => console.error('[DiningPage] 菜品图片加载失败:', dish.name)}
                  />
                  <View className={styles.dishInfo}>
                    <View className={styles.dishHeader}>
                      <Text className={styles.dishName}>
                        {dish.name}
                        {dish.isSpecial && <Text className={styles.specialBadge}>招牌</Text>}
                      </Text>
                      <Text className={styles.dishPrice}>{formatPrice(dish.price)}</Text>
                    </View>
                    <Text className={styles.dishDesc}>{dish.description}</Text>
                    <View className={styles.dishFooter}>
                      <Text className={styles.spicyLevel}>🌶️ {getSpicyText(dish.spicyLevel)}</Text>
                      <View className={styles.quantityControl}>
                        <View
                          className={styles.quantityBtn}
                          onClick={() => handleQuantityChange(dish.id, -1)}
                        >
                          -
                        </View>
                        <Text className={styles.quantityValue}>{quantities[dish.id] || 0}</Text>
                        <View
                          className={styles.quantityBtn}
                          onClick={() => handleQuantityChange(dish.id, 1)}
                        >
                          +
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View>
          <View className={styles.totalInfo}>
            <Text className={styles.totalLabel}>合计：</Text>
            <Text className={styles.totalPrice}>{formatPrice(getTotalPrice())}</Text>
          </View>
          <Text className={styles.countInfo}>共{getTotalCount()}份菜品</Text>
        </View>
        <View className={styles.bookBtn} onClick={handleBook}>
          立即预订
        </View>
      </View>

      {showBookingModal && (
        <View className={styles.bookingModal} onClick={() => setShowBookingModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>预订信息</Text>
              <Text className={styles.closeBtn} onClick={() => setShowBookingModal(false)}>×</Text>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>用餐日期</Text>
              <picker
                mode="date"
                value={selectedDate || today}
                start={today}
                onChange={handleDateChange}
              >
                <View className={styles.datePicker}>
                  {selectedDate || '请选择用餐日期'}
                </View>
              </picker>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>用餐时间</Text>
              <View className={styles.timeSlots}>
                {timeSlots.map(time => (
                  <View
                    key={time}
                    className={classnames(styles.timeSlot, selectedTime === time && styles.active)}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>用餐人数</Text>
              <View className={styles.guestControl}>
                <View className={styles.guestBtn} onClick={() => handleGuestChange(-1)}>
                  -
                </View>
                <View>
                  <Text className={styles.guestValue}>{guestCount}</Text>
                  <Text className={styles.guestLabel}>人</Text>
                </View>
                <View className={styles.guestBtn} onClick={() => handleGuestChange(1)}>
                  +
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.packageHeader}>
                <Text className={styles.formLabel}>订单金额</Text>
                <Text className={styles.totalPrice}>{formatPrice(getTotalPrice())}</Text>
              </View>
            </View>

            <View className={styles.confirmBtn} onClick={handleConfirmBooking}>
              确认预订
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DiningPage;
