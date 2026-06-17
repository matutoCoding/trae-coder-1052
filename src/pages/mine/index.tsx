import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { bookingList } from '@/data/reviews';

const orderTabs = [
  { key: 'pending', label: '待确认', icon: '📋', color: '#FFF4E5', badge: 1 },
  { key: 'confirmed', label: '已确认', icon: '✅', color: '#E8F5E9', badge: 2 },
  { key: 'checkedIn', label: '已入住', icon: '🏠', color: '#E3F2FD', badge: 1 },
  { key: 'checkedOut', label: '已退房', icon: '📝', color: '#F3E5F5', badge: 0 }
];

const menuItems = [
  { key: 'booking', title: '我的订单', desc: '查看所有预订记录', icon: '📋', color: '#E8D5C4', path: '/pages/activity/index' },
  { key: 'refund', title: '退订处理', desc: '申请退订与退款', icon: '↩️', color: '#F5E0D3', path: '/pages/refund/index' },
  { key: 'review', title: '客人评价', desc: '查看和发表评价', icon: '⭐', color: '#FFF4E5', path: '/pages/review/index' },
  { key: 'statistics', title: '收益统计', desc: '查看经营数据', icon: '📊', color: '#E8D5C4', path: '/pages/statistics/index' },
  { key: 'dining', title: '餐饮预订', desc: '预订客家美食', icon: '🍽️', color: '#D4E6D5', path: '/pages/dining/index' },
  { key: 'activity', title: '活动管理', desc: '管理文化体验活动', icon: '🎉', color: '#FCE4EC', path: '/pages/activity/index' }
];

const bottomMenuItems = [
  { key: 'service', title: '联系客服', desc: '7x24小时在线服务', icon: '📞', color: '#E3F2FD' },
  { key: 'setting', title: '设置', desc: '账号与偏好设置', icon: '⚙️', color: '#F5F5F5' }
];

const MinePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[MinePage] 页面加载');
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const onPullDownRefresh = () => {
    console.log('[MinePage] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const handleOrderClick = (key: string) => {
    console.log('[MinePage] 点击订单状态:', key);
    Taro.showToast({
      title: `查看${orderTabs.find(t => t.key === key)?.label}订单`,
      icon: 'none'
    });
  };

  const handleAllOrders = () => {
    console.log('[MinePage] 查看全部订单');
    Taro.navigateTo({ url: '/pages/activity/index' });
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    console.log('[MinePage] 点击菜单:', item.key);
    if (item.path) {
      Taro.navigateTo({ url: item.path });
    } else {
      Taro.showToast({
        title: item.title,
        icon: 'none'
      });
    }
  };

  const handleBottomMenuClick = (item: typeof bottomMenuItems[0]) => {
    console.log('[MinePage] 点击底部菜单:', item.key);
    Taro.showToast({
      title: item.title,
      icon: 'none'
    });
  };

  const pendingCount = bookingList.filter(b => b.status === 'pending').length;
  const confirmedCount = bookingList.filter(b => b.status === 'confirmed').length;
  const checkedInCount = bookingList.filter(b => b.status === 'checkedIn').length;
  const checkedOutCount = bookingList.filter(b => b.status === 'checkedOut').length;

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.avatar}>
          <Image
            className={styles.avatarImage}
            src="https://picsum.photos/id/64/200/200"
            mode="aspectFill"
            onError={() => console.error('[MinePage] 头像加载失败')}
          />
        </View>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>客家土楼民宿</Text>
          <Text className={styles.userDesc}>欢迎来到世界文化遗产地</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.orderCard}>
          <View className={styles.orderHeader}>
            <Text className={styles.orderTitle}>我的订单</Text>
            <Text className={styles.orderAll} onClick={handleAllOrders}>
              全部订单 →
            </Text>
          </View>
          <View className={styles.orderTabs}>
            {orderTabs.map(tab => {
              let count = 0;
              if (tab.key === 'pending') count = pendingCount;
              else if (tab.key === 'confirmed') count = confirmedCount;
              else if (tab.key === 'checkedIn') count = checkedInCount;
              else if (tab.key === 'checkedOut') count = checkedOutCount;
              
              return (
                <View
                  key={tab.key}
                  className={styles.orderTab}
                  onClick={() => handleOrderClick(tab.key)}
                >
                  <View className={styles.orderIcon} style={{ backgroundColor: tab.color, position: 'relative' }}>
                    {tab.icon}
                    {count > 0 && (
                      <View className={styles.orderBadge}>{count}</View>
                    )}
                  </View>
                  <Text className={styles.orderLabel}>{tab.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.menuCard}>
          {menuItems.map(item => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item)}
            >
              <View className={styles.menuIcon} style={{ backgroundColor: item.color }}>
                {item.icon}
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>

        <View className={styles.menuCard}>
          {bottomMenuItems.map(item => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleBottomMenuClick(item)}
            >
              <View className={styles.menuIcon} style={{ backgroundColor: item.color }}>
                {item.icon}
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MinePage;
