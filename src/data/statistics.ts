import type { StatisticsData } from '@/types';

export const statisticsData: StatisticsData = {
  todayCheckIn: 8,
  todayCheckOut: 6,
  occupancyRate: 78.5,
  todayRevenue: 8650,
  monthRevenue: 186580,
  totalBookings: 156,
  roomRevenue: [32000, 28000, 45000, 38000, 52000, 25000],
  monthlyRevenue: [
    { month: '1月', revenue: 125000 },
    { month: '2月', revenue: 186000 },
    { month: '3月', revenue: 142000 },
    { month: '4月', revenue: 168000 },
    { month: '5月', revenue: 195000 },
    { month: '6月', revenue: 186580 }
  ],
  roomTypeStats: [
    { type: '豪华套房', count: 42, revenue: 86400 },
    { type: '标准间', count: 68, revenue: 52800 },
    { type: '家庭房', count: 26, revenue: 35600 },
    { type: '大床房', count: 20, revenue: 11780 }
  ]
};

export const weekOccupancyData = [
  { day: '周一', rate: 65 },
  { day: '周二', rate: 72 },
  { day: '周三', rate: 68 },
  { day: '周四', rate: 75 },
  { day: '周五', rate: 85 },
  { day: '周六', rate: 92 },
  { day: '周日', rate: 88 }
];

export const recentBookings = [
  { id: 'BK20260618001', guest: '张伟', room: '豪华套房', amount: 2064, time: '14:30', status: 'confirmed' },
  { id: 'BK20260618002', guest: '李娜', room: '标准间', amount: 776, time: '12:15', status: 'confirmed' },
  { id: 'BK20260618003', guest: '王芳', room: '家庭房', amount: 1056, time: '10:45', status: 'checkedIn' },
  { id: 'BK20260618004', guest: '陈刚', room: '大床房', amount: 894, time: '09:20', status: 'pending' },
  { id: 'BK20260618005', guest: '刘洋', room: '豪华套房', amount: 1776, time: '08:00', status: 'cancelled' }
];
