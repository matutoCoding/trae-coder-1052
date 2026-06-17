import type { Dish } from '@/types';

export const dishList: Dish[] = [
  {
    id: '1',
    name: '客家酿豆腐',
    price: 48,
    description: '客家招牌名菜，选用嫩滑山水豆腐，嵌入新鲜猪肉馅料，煎至金黄，配以秘制酱汁，鲜香四溢。',
    image: 'https://picsum.photos/id/292/300/300',
    category: '招牌菜',
    isSpecial: true,
    spicyLevel: 1
  },
  {
    id: '2',
    name: '梅菜扣肉',
    price: 68,
    description: '精选五花肉，配以客家自制梅干菜，蒸制数小时而成。肉质酥烂，肥而不腻，梅菜香浓。',
    image: 'https://picsum.photos/id/312/300/300',
    category: '招牌菜',
    isSpecial: true,
    spicyLevel: 0
  },
  {
    id: '3',
    name: '客家盐焗鸡',
    price: 88,
    description: '选用散养土鸡，以传统盐焗技法烹制，皮脆肉嫩，鲜美多汁，是客家宴席必备佳肴。',
    image: 'https://picsum.photos/id/326/300/300',
    category: '招牌菜',
    isSpecial: true,
    spicyLevel: 0
  },
  {
    id: '4',
    name: '炒土猪肉',
    price: 58,
    description: '选用当地农户散养土猪肉，肉质鲜嫩，配以青椒、大蒜爆炒，家常味道，回味无穷。',
    image: 'https://picsum.photos/id/401/300/300',
    category: '热菜',
    isSpecial: false,
    spicyLevel: 2
  },
  {
    id: '5',
    name: '清蒸水库鱼',
    price: 78,
    description: '取自土楼后山清水水库的鲜活草鱼，清蒸保留原汁原味，肉质细嫩，清甜可口。',
    image: 'https://picsum.photos/id/431/300/300',
    category: '热菜',
    isSpecial: false,
    spicyLevel: 0
  },
  {
    id: '6',
    name: '艾粄',
    price: 28,
    description: '客家传统时令点心，以新鲜艾草与糯米粉制作，内包花生芝麻馅，清香软糯，具有祛湿功效。',
    image: 'https://picsum.photos/id/570/300/300',
    category: '点心',
    isSpecial: true,
    spicyLevel: 0
  },
  {
    id: '7',
    name: '客家糍粑',
    price: 22,
    description: '现打糯米糍粑，外裹黄豆粉、花生碎，香甜软糯，是客家人逢年过节必备的传统美食。',
    image: 'https://picsum.photos/id/580/300/300',
    category: '点心',
    isSpecial: true,
    spicyLevel: 0
  },
  {
    id: '8',
    name: '清炒时蔬',
    price: 26,
    description: '当日采摘的农家新鲜蔬菜，清炒保留原味，健康营养，清爽解腻。',
    image: 'https://picsum.photos/id/625/300/300',
    category: '素菜',
    isSpecial: false,
    spicyLevel: 0
  },
  {
    id: '9',
    name: '苦笋炒肉',
    price: 42,
    description: '客家山区特色苦笋，配以土猪肉炒制，先苦后甘，清热解毒，是夏季开胃佳品。',
    image: 'https://picsum.photos/id/835/300/300',
    category: '热菜',
    isSpecial: false,
    spicyLevel: 1
  },
  {
    id: '10',
    name: '土楼老火靓汤',
    price: 38,
    description: '每日例汤，选用当季食材，慢火熬制数小时，滋补养生，健脾开胃。',
    image: 'https://picsum.photos/id/1080/300/300',
    category: '汤品',
    isSpecial: false,
    spicyLevel: 0
  },
  {
    id: '11',
    name: '五指毛桃煲鸡汤',
    price: 68,
    description: '客家特色药膳汤，以五指毛桃配土鸡慢炖，汤清味浓，有补气养生之功效。',
    image: 'https://picsum.photos/id/1037/300/300',
    category: '汤品',
    isSpecial: true,
    spicyLevel: 0
  },
  {
    id: '12',
    name: '腌面',
    price: 18,
    description: '客家早餐经典，手工面条配以猪油、葱花、鱼露，香气扑鼻，简单美味。',
    image: 'https://picsum.photos/id/225/300/300',
    category: '主食',
    isSpecial: true,
    spicyLevel: 0
  }
];

export const dishCategories = [
  { key: 'all', label: '全部' },
  { key: '招牌菜', label: '招牌菜' },
  { key: '热菜', label: '热菜' },
  { key: '素菜', label: '素菜' },
  { key: '汤品', label: '汤品' },
  { key: '点心', label: '点心' },
  { key: '主食', label: '主食' }
];

export const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

export const diningPackages = [
  {
    id: 'p1',
    name: '双人客家套餐',
    price: 168,
    originalPrice: 216,
    dishes: ['客家酿豆腐', '清炒时蔬', '土楼老火靓汤', '米饭2碗'],
    suitable: '2人'
  },
  {
    id: 'p2',
    name: '家庭欢聚套餐',
    price: 328,
    originalPrice: 428,
    dishes: ['梅菜扣肉', '客家盐焗鸡半只', '炒土猪肉', '清蒸水库鱼', '清炒时蔬', '五指毛桃汤', '艾粄', '米饭'],
    suitable: '4-6人'
  },
  {
    id: 'p3',
    name: '土楼全宴',
    price: 688,
    originalPrice: 888,
    dishes: ['客家酿豆腐', '梅菜扣肉', '客家盐焗鸡整只', '炒土猪肉', '清蒸水库鱼', '苦笋炒肉', '清炒时蔬', '五指毛桃汤', '艾粄', '客家糍粑', '米饭'],
    suitable: '8-10人'
  }
];
