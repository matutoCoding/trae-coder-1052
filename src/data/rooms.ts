import type { Room, RoomCalendar } from '@/types';

export const roomList: Room[] = [
  {
    id: '1',
    name: '怀远堂豪华套房',
    type: '豪华套房',
    price: 688,
    originalPrice: 888,
    bedType: '1.8米大床',
    area: 45,
    floor: '2楼',
    maxGuests: 3,
    facilities: ['独立卫浴', '空调', 'WiFi', '电视', '茶台', '观景窗'],
    images: [
      'https://picsum.photos/id/1048/750/500',
      'https://picsum.photos/id/1040/750/500',
      'https://picsum.photos/id/1038/750/500'
    ],
    description: '位于土楼二楼东侧，采光极佳，可俯瞰土楼天井全景。房间采用客家传统木质装修风格，配备现代化设施，让您在感受传统文化的同时享受舒适住宿体验。',
    status: 'available',
    rating: 4.9,
    reviewCount: 128
  },
  {
    id: '2',
    name: '振成楼观景房',
    type: '标准间',
    price: 388,
    originalPrice: 488,
    bedType: '1.5米双床',
    area: 28,
    floor: '3楼',
    maxGuests: 2,
    facilities: ['独立卫浴', '空调', 'WiFi', '电视', '衣柜'],
    images: [
      'https://picsum.photos/id/1056/750/500',
      'https://picsum.photos/id/1057/750/500'
    ],
    description: '位于土楼三楼南侧，面向青山绿水，视野开阔。房间整洁舒适，是家庭出游和背包客的理想选择。',
    status: 'available',
    rating: 4.7,
    reviewCount: 256
  },
  {
    id: '3',
    name: '承启楼家庭房',
    type: '家庭房',
    price: 528,
    originalPrice: 628,
    bedType: '1.8米大床+1.2米小床',
    area: 38,
    floor: '1楼',
    maxGuests: 4,
    facilities: ['独立卫浴', '空调', 'WiFi', '电视', '茶台', '儿童用品'],
    images: [
      'https://picsum.photos/id/1044/750/500',
      'https://picsum.photos/id/1036/750/500'
    ],
    description: '位于土楼一楼北侧，出入方便，适合家庭入住。房间配备儿童专用洗漱用品和小床，让您的家庭旅行更加温馨舒适。',
    status: 'booked',
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: '4',
    name: '土楼民俗大床房',
    type: '大床房',
    price: 298,
    originalPrice: 368,
    bedType: '1.5米大床',
    area: 22,
    floor: '2楼',
    maxGuests: 2,
    facilities: ['公共卫浴', '空调', 'WiFi', '衣柜'],
    images: [
      'https://picsum.photos/id/1043/750/500',
      'https://picsum.photos/id/1041/750/500'
    ],
    description: '体验原汁原味的土楼生活，房间保留了客家传统建筑特色，公共卫浴干净整洁，是体验土楼文化的经济之选。',
    status: 'available',
    rating: 4.5,
    reviewCount: 312
  },
  {
    id: '5',
    name: '天井景观套房',
    type: '豪华套房',
    price: 888,
    originalPrice: 1088,
    bedType: '2.0米特大床',
    area: 55,
    floor: '3楼',
    maxGuests: 2,
    facilities: ['独立卫浴', '空调', 'WiFi', '智能电视', '茶台', '观景阳台', '迷你吧'],
    images: [
      'https://picsum.photos/id/1047/750/500',
      'https://picsum.photos/id/1039/750/500',
      'https://picsum.photos/id/1051/750/500'
    ],
    description: '土楼顶级客房，位于三楼正中央，独享天井全景。房间装修奢华典雅，配备私人观景阳台，是蜜月旅行和高端商务人士的首选。',
    status: 'available',
    rating: 5.0,
    reviewCount: 67
  },
  {
    id: '6',
    name: '客家温馨标准间',
    type: '标准间',
    price: 258,
    originalPrice: 328,
    bedType: '1.2米双床',
    area: 20,
    floor: '1楼',
    maxGuests: 2,
    facilities: ['公共卫浴', '空调', 'WiFi', '衣柜'],
    images: [
      'https://picsum.photos/id/1053/750/500',
      'https://picsum.photos/id/1054/750/500'
    ],
    description: '简洁舒适的标准间，位于土楼一楼，出入方便。房间干净整洁，是预算有限的旅客的绝佳选择。',
    status: 'maintenance',
    rating: 4.4,
    reviewCount: 178
  }
];

export const generateCalendarData = (roomId: string): RoomCalendar[] => {
  const data: RoomCalendar[] = [];
  const today = new Date();
  const basePrice = roomList.find(r => r.id === roomId)?.price || 298;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPeakSeason = date.getMonth() >= 6 && date.getMonth() <= 8;
    
    let price = basePrice;
    if (isWeekend) price = Math.round(basePrice * 1.2);
    if (isPeakSeason) price = Math.round(basePrice * 1.5);
    
    const random = Math.random();
    let status: 'available' | 'booked' | 'pending' = 'available';
    if (random < 0.3) status = 'booked';
    else if (random < 0.4) status = 'pending';
    
    data.push({ date: dateStr, status, price });
  }
  return data;
};
