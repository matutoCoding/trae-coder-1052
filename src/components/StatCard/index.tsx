import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  value: string | number;
  suffix?: string;
  label: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ value, suffix, label, trend, onClick }) => {
  return (
    <View className={styles.card} onClick={onClick}>
      <Text className={styles.value}>
        {value}
        {suffix && <Text className={styles.suffix}>{suffix}</Text>}
      </Text>
      <Text className={styles.label}>{label}</Text>
      {trend && (
        <Text className={classnames(styles.trend, trend.direction)}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
        </Text>
      )}
    </View>
  );
};

export default StatCard;
