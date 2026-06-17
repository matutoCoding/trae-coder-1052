import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import { statisticsData, weekOccupancyData, recentBookings } from '@/data/statistics';
import { formatPrice, getStatusText } from '@/utils';

const StatisticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[StatisticsPage] 页面加载');
    setTimeout(() => setLoading(false), 300);
  }, []);

  const handlePeriodChange = (p: 'week' | 'month') => {
    console.log('[StatisticsPage] 切换周期:', p);
    setPeriod(p);
  };

  const chartData = period === 'week' 
    ? weekOccupancyData.map(d => ({ label: d.day, value: d.rate }))
    : statisticsData.monthlyRevenue.map(d => ({ label: d.month, value: d.revenue / 1000 }));

  const maxValue = Math.max(...chartData.map(d => d.value));

  const roomTypeColors = ['#C4956A', '#5D7A6B', '#D4A574', '#E8D5C4'];
  const totalRevenue = statisticsData.roomTypeStats.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.summaryCards}>
          <StatCard
            value={statisticsData.todayRevenue}
            suffix="元"
            label="今日营收"
            trend={{ value: '8%', direction: 'up' }}
          />
          <StatCard
            value={statisticsData.monthRevenue.toLocaleString()}
            suffix="元"
            label="本月营收"
            trend={{ value: '12%', direction: 'up' }}
          />
          <StatCard
            value={statisticsData.occupancyRate}
            suffix="%"
            label="入住率"
            trend={{ value: '5%', direction: 'up' }}
          />
          <StatCard
            value={statisticsData.totalBookings}
            suffix="单"
            label="总订单数"
          />
        </View>

        <View className={styles.chartCard}>
          <View className={styles.chartHeader}>
            <Text className={styles.chartTitle}>营收趋势</Text>
            <View className={styles.chartTabs}>
              <View
                className={classnames(styles.chartTab, period === 'week' && styles.active)}
                onClick={() => handlePeriodChange('week')}
              >
                本周
              </View>
              <View
                className={classnames(styles.chartTab, period === 'month' && styles.active)}
                onClick={() => handlePeriodChange('month')}
              >
                本月
              </View>
            </View>
          </View>
          
          <View className={styles.barChart}>
            {chartData.map((item, index) => (
              <View key={index} className={styles.barItem}>
                <View
                  className={styles.bar}
                  style={{ height: `${(item.value / maxValue) * 80}%` }}
                >
                  <Text className={styles.barValue}>
                    {period === 'week' ? `${item.value}%` : `${item.value}k`}
                  </Text>
                </View>
                <Text className={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text className={styles.sectionTitle}>房型营收分析</Text>
        <View className={styles.chartCard}>
          <View className={styles.pieChart}>
            <View
              className={styles.pie}
              style={{
                background: `conic-gradient(
                  ${roomTypeColors[0]} 0deg ${(statisticsData.roomTypeStats[0].revenue / totalRevenue) * 360}deg,
                  ${roomTypeColors[1]} ${(statisticsData.roomTypeStats[0].revenue / totalRevenue) * 360}deg ${((statisticsData.roomTypeStats[0].revenue + statisticsData.roomTypeStats[1].revenue) / totalRevenue) * 360}deg,
                  ${roomTypeColors[2]} ${((statisticsData.roomTypeStats[0].revenue + statisticsData.roomTypeStats[1].revenue) / totalRevenue) * 360}deg ${((statisticsData.roomTypeStats[0].revenue + statisticsData.roomTypeStats[1].revenue + statisticsData.roomTypeStats[2].revenue) / totalRevenue) * 360}deg,
                  ${roomTypeColors[3]} ${((statisticsData.roomTypeStats[0].revenue + statisticsData.roomTypeStats[1].revenue + statisticsData.roomTypeStats[2].revenue) / totalRevenue) * 360}deg 360deg
                )`
              }}
            >
              <View className={styles.pieCenter}>
                <Text className={styles.pieValue}>{(totalRevenue / 1000).toFixed(0)}k</Text>
                <Text className={styles.pieLabel}>总营收</Text>
              </View>
            </View>
            
            <View className={styles.legend}>
              {statisticsData.roomTypeStats.map((stat, index) => (
                <View key={index} className={styles.legendItem}>
                  <View className={styles.legendLeft}>
                    <View
                      className={styles.legendColor}
                      style={{ backgroundColor: roomTypeColors[index] }}
                    />
                    <Text className={styles.legendName}>{stat.type}</Text>
                  </View>
                  <View className={styles.legendRight}>
                    <Text className={styles.legendAmount}>{formatPrice(stat.revenue)}</Text>
                    <Text className={styles.legendPercent}>
                      {((stat.revenue / totalRevenue) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text className={styles.sectionTitle}>最近订单</Text>
        <View className={styles.bookingList}>
          <View className={styles.bookingHeader}>
            <Text className={classnames(styles.bookingCell, styles.name)}>客人</Text>
            <Text className={classnames(styles.bookingCell, styles.room)}>房型</Text>
            <Text className={classnames(styles.bookingCell, styles.amount)}>金额</Text>
            <Text className={classnames(styles.bookingCell, styles.time)}>时间</Text>
            <Text className={classnames(styles.bookingCell, styles.status)}>状态</Text>
          </View>
          
          {recentBookings.map(booking => (
            <View key={booking.id} className={styles.bookingRow}>
              <Text className={classnames(styles.bookingCell, styles.name)}>{booking.guest}</Text>
              <Text className={classnames(styles.bookingCell, styles.room)}>{booking.room}</Text>
              <Text className={classnames(styles.bookingCell, styles.amount)}>{formatPrice(booking.amount)}</Text>
              <Text className={classnames(styles.bookingCell, styles.time)}>{booking.time}</Text>
              <Text className={classnames(styles.bookingCell, styles.status)}>
                <Text className={classnames(styles.statusTag, booking.status)}>
                  {getStatusText(booking.status)}
                </Text>
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default StatisticsPage;
