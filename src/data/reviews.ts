import type { Review, Booking, RefundRecord, TulouInfo, NearbyAttraction } from '@/types';

export const reviewList: Review[] = [
  {
    id: '1',
    roomId: '1',
    userName: '张伟',
    avatar: 'https://picsum.photos/id/64/200/200',
    rating: 5,
    content: '非常棒的住宿体验！土楼的建筑太震撼了，房间干净整洁，设施齐全。晚上在天井看星星，清晨被鸟鸣叫醒，真正感受到了客家文化的魅力。老板娘人特别热情，还给我们讲了很多土楼的历史故事。强烈推荐！',
    images: [
      'https://picsum.photos/id/1048/400/300',
      'https://picsum.photos/id/1040/400/300'
    ],
    date: '2026-06-15',
    type: 'room',
    reply: '感谢您的好评！我们会继续努力，让更多客人感受到土楼的魅力。欢迎下次再来！'
  },
  {
    id: '2',
    userName: '李娜',
    avatar: 'https://picsum.photos/id/91/200/200',
    rating: 5,
    content: '采茶制茶体验太棒了！清晨跟着茶农上山采茶，看着茶叶在自己手中慢慢成型，最后喝到自己做的茶，那种成就感无法言喻。茶农师傅很专业，讲解也很细致。',
    images: [
      'https://picsum.photos/id/1039/400/300'
    ],
    date: '2026-06-14',
    type: 'activity',
    reply: '感谢您的参与！我们的制茶体验课每月都有，欢迎您再次来体验不同季节的茶叶制作。'
  },
  {
    id: '3',
    roomId: '2',
    userName: '王芳',
    avatar: 'https://picsum.photos/id/177/200/200',
    rating: 4,
    content: '房间干净整洁，风景很好，推开窗就能看到青山。土楼的氛围很特别，晚上和其他客人一起在天井聊天，很有意思。唯一的小建议是隔音可以再好一些。',
    images: [],
    date: '2026-06-13',
    type: 'room'
  },
  {
    id: '4',
    userName: '陈刚',
    avatar: 'https://picsum.photos/id/338/200/200',
    rating: 5,
    content: '客家酿豆腐太好吃了！还有梅菜扣肉，都是小时候外婆做的味道。餐厅环境也很好，就在土楼一楼，边吃饭边看天井的风景，很有感觉。价格也实惠，分量足。',
    images: [
      'https://picsum.photos/id/292/400/300',
      'https://picsum.photos/id/312/400/300'
    ],
    date: '2026-06-12',
    type: 'dining',
    reply: '谢谢您的喜爱！我们的食材都是当地农家新鲜采购的，下次来可以尝尝我们的客家盐焗鸡，也很受欢迎哦！'
  },
  {
    id: '5',
    roomId: '5',
    userName: '刘洋',
    avatar: 'https://picsum.photos/id/1027/200/200',
    rating: 5,
    content: '蜜月旅行选择了这里，绝对是最正确的决定！天井景观套房太浪漫了，晚上在阳台上看星星，特别美。老板娘还贴心地为我们准备了蜜月布置和红酒，服务超赞！',
    images: [
      'https://picsum.photos/id/1047/400/300',
      'https://picsum.photos/id/1039/400/300'
    ],
    date: '2026-06-10',
    type: 'room',
    reply: '祝两位新婚快乐！永远幸福！感谢您选择我们的土楼民宿见证您的美好时刻，期待您的再次光临！'
  },
  {
    id: '6',
    userName: '赵敏',
    avatar: 'https://picsum.photos/id/64/200/200',
    rating: 4,
    content: '带孩子参加了研学营，孩子玩得很开心，还学到了很多知识。老师很专业，组织得也很好。孩子回来后一直念叨着还要再来。唯一不足是天气太热了，建议多安排一些室内活动。',
    images: [
      'https://picsum.photos/id/1045/400/300'
    ],
    date: '2026-06-08',
    type: 'activity'
  },
  {
    id: '7',
    roomId: '1',
    userName: '陈小红',
    avatar: 'https://picsum.photos/id/65/200/200',
    rating: 4,
    content: '怀远堂套房设施很新，装修保留了客家风格又有现代舒适感。茶台很赞，泡了铁观音慢慢品，窗外就是土楼天井。就是热水有点慢，等了几分钟才来。',
    images: [
      'https://picsum.photos/id/1043/400/300'
    ],
    date: '2026-06-07',
    type: 'room'
  },
  {
    id: '8',
    roomId: '3',
    userName: '林大海',
    avatar: 'https://picsum.photos/id/91/200/200',
    rating: 5,
    content: '带两个孩子住家庭房，空间很宽敞，儿童用品很贴心。一楼出入方便，院子里孩子跑来跑去玩得开心。老板还送了客家米酒，味道醇厚！',
    images: [
      'https://picsum.photos/id/1044/400/300',
      'https://picsum.photos/id/1036/400/300',
      'https://picsum.photos/id/1038/400/300'
    ],
    date: '2026-06-06',
    type: 'room',
    reply: '感谢一家人的光临！孩子们开心我们就放心了，下次来可以带孩子参加土楼研学活动，更有趣！'
  },
  {
    id: '9',
    roomId: '4',
    userName: '孙丽丽',
    avatar: 'https://picsum.photos/id/177/200/200',
    rating: 3,
    content: '民俗大床房价格实惠，但公共卫浴确实不太方便，晚上要排队。房间本身还是干净的，空调WiFi都有。如果预算有限可以试试，追求品质的还是选独立卫浴的房型吧。',
    images: [],
    date: '2026-06-05',
    type: 'room'
  },
  {
    id: '10',
    roomId: '5',
    userName: '周杰',
    avatar: 'https://picsum.photos/id/338/200/200',
    rating: 5,
    content: '天井景观套房绝对是土楼民宿的天花板！阳台正对天井，日出日落都绝美。迷你吧的客家小吃很惊喜，智能电视可以投屏。值得每一分钱！',
    images: [
      'https://picsum.photos/id/1047/400/300',
      'https://picsum.photos/id/1051/400/300',
      'https://picsum.photos/id/1039/400/300',
      'https://picsum.photos/id/1040/400/300'
    ],
    date: '2026-06-04',
    type: 'room',
    reply: '感谢您的高度认可！天井套房确实是我们最用心的作品，期待您再次光临体验不同季节的土楼之美。'
  },
  {
    id: '11',
    roomId: '2',
    userName: '黄小芳',
    avatar: 'https://picsum.photos/id/1027/200/200',
    rating: 5,
    content: '振成楼观景房视野超棒！三楼能看到整片青山和梯田，早上被云海美醒。房间虽然是标准间但布置得很温馨，床品也很舒服。下次还会选这个房型！',
    images: [
      'https://picsum.photos/id/1056/400/300',
      'https://picsum.photos/id/1057/400/300'
    ],
    date: '2026-06-03',
    type: 'room',
    reply: '感谢您的好评！三楼的观景效果确实一流，建议您秋冬再来，云海更壮观！'
  },
  {
    id: '12',
    roomId: '4',
    userName: '马飞',
    avatar: 'https://picsum.photos/id/65/200/200',
    rating: 4,
    content: '民俗大床房体验到了原汁原味的土楼生活，木质结构很有味道。公共卫浴比想象中干净很多，阿姨打扫很勤快。性价比很高，学生党推荐！',
    images: [
      'https://picsum.photos/id/1041/400/300'
    ],
    date: '2026-06-02',
    type: 'room'
  },
  {
    id: '13',
    roomId: '6',
    userName: '吴明',
    avatar: 'https://picsum.photos/id/91/200/200',
    rating: 4,
    content: '温馨标准间虽然面积不大但五脏俱全，双床适合和朋友一起住。一楼出入方便，晚上在天井纳凉很惬意。就是隔壁说话能听到一点，隔音一般。',
    images: [],
    date: '2026-06-01',
    type: 'room'
  },
  {
    id: '14',
    roomId: '1',
    userName: '郑美丽',
    avatar: 'https://picsum.photos/id/177/200/200',
    rating: 5,
    content: '第二次住怀远堂了，这次带了爸妈一起来。老人家特别喜欢这里，说住出了小时候的感觉。茶台泡茶、观景窗看天井，爸妈赞不绝口！',
    images: [
      'https://picsum.photos/id/1048/400/300',
      'https://picsum.photos/id/1040/400/300',
      'https://picsum.photos/id/1038/400/300'
    ],
    date: '2026-05-28',
    type: 'room'
  },
  {
    id: '15',
    roomId: '3',
    userName: '杨帆',
    avatar: 'https://picsum.photos/id/338/200/200',
    rating: 4,
    content: '家庭房带小朋友住非常合适，有专门的儿童洗漱用品和小拖鞋。楼下就是院子，孩子玩得安全。唯一遗憾是房间在1楼采光略差，但出门方便弥补了这点。',
    images: [
      'https://picsum.photos/id/1044/400/300'
    ],
    date: '2026-05-25',
    type: 'room'
  }
];

export const bookingList: Booking[] = [
  {
    id: 'BK20260618001',
    roomId: '1',
    roomName: '怀远堂豪华套房',
    checkIn: '2026-06-20',
    checkOut: '2026-06-23',
    nights: 3,
    guests: 2,
    guestName: '张伟',
    phone: '138****8888',
    totalPrice: 2064,
    deposit: 500,
    status: 'confirmed',
    createTime: '2026-06-15 14:30'
  },
  {
    id: 'BK20260618002',
    roomId: '2',
    roomName: '振成楼观景房',
    checkIn: '2026-06-19',
    checkOut: '2026-06-21',
    nights: 2,
    guests: 2,
    guestName: '李娜',
    phone: '139****6666',
    totalPrice: 776,
    deposit: 300,
    status: 'checkedIn',
    createTime: '2026-06-14 09:15'
  },
  {
    id: 'BK20260618003',
    roomId: '3',
    roomName: '承启楼家庭房',
    checkIn: '2026-06-18',
    checkOut: '2026-06-20',
    nights: 2,
    guests: 4,
    guestName: '王芳',
    phone: '137****5555',
    totalPrice: 1056,
    deposit: 400,
    status: 'checkedOut',
    createTime: '2026-06-12 16:45'
  },
  {
    id: 'BK20260618004',
    roomId: '4',
    roomName: '土楼民俗大床房',
    checkIn: '2026-06-25',
    checkOut: '2026-06-28',
    nights: 3,
    guests: 2,
    guestName: '陈刚',
    phone: '136****4444',
    totalPrice: 894,
    deposit: 300,
    status: 'pending',
    createTime: '2026-06-17 20:20',
    specialRequests: '希望安排安静一点的房间'
  },
  {
    id: 'BK20260618005',
    roomId: '5',
    roomName: '天井景观套房',
    checkIn: '2026-06-16',
    checkOut: '2026-06-18',
    nights: 2,
    guests: 2,
    guestName: '刘洋',
    phone: '135****3333',
    totalPrice: 1776,
    deposit: 600,
    status: 'cancelled',
    createTime: '2026-06-10 11:00'
  }
];

export const refundList: RefundRecord[] = [
  {
    id: 'RF20260618001',
    bookingId: 'BK20260618005',
    reason: '行程临时变更',
    amount: 1200,
    status: 'completed',
    applyTime: '2026-06-15 09:30',
    processTime: '2026-06-15 10:00',
    refundTime: '2026-06-15 10:30'
  },
  {
    id: 'RF20260618002',
    bookingId: 'BK20260618004',
    reason: '身体不适',
    amount: 600,
    status: 'pending',
    applyTime: '2026-06-18 08:00'
  }
];

export const tulouInfo: TulouInfo = {
  name: '怀远土楼',
  history: '怀远土楼始建于清康熙四十年（1701年），由客家陈氏先祖历时五年建成，至今已有300余年历史。土楼呈圆形，直径68米，高15米，共三层，有房屋108间，是客家圆形土楼的典型代表。土楼曾经历多次战乱和自然灾害，至今仍保存完好，是客家文化的活化石。',
  architecture: '怀远土楼为三圈环形建筑，外圈为三层主楼，用夯土砌筑，厚达1.8米，具有极好的防御和保温功能。楼内天井中心设有祖堂，是宗族祭祀和议事的场所。土楼建筑充分体现了客家人聚族而居、勤劳智慧的特点，其建筑工艺被列入国家级非物质文化遗产名录。',
  culture: '客家文化是中原文化与岭南文化融合的结晶，土楼是客家文化的重要载体。怀远土楼至今保留着完整的客家民俗传统，如祭祖、客家山歌、客家美食制作等。每年春节、端午、中秋等传统节日，土楼都会举办盛大的民俗活动，吸引众多游客前来体验。',
  location: '福建省龙岩市永定区湖坑镇',
  buildTime: '清康熙四十年（1701年）',
  area: '约5300平方米',
  population: '现居30余户，150余人',
  highlights: [
    '世界文化遗产地',
    '国家级文物保护单位',
    '客家文化活化石',
    '《大鱼海棠》取景地',
    '中国最美土楼'
  ],
  images: [
    'https://picsum.photos/id/1082/750/500',
    'https://picsum.photos/id/1036/750/500',
    'https://picsum.photos/id/1039/750/500',
    'https://picsum.photos/id/1044/750/500'
  ]
};

export const nearbyAttractions: NearbyAttraction[] = [
  {
    id: '1',
    name: '洪坑土楼民俗文化村',
    distance: '3公里',
    description: '国家5A级旅游景区，汇集了圆形、方形、五凤楼等各种形态的土楼，是了解客家土楼建筑文化的最佳去处。',
    image: 'https://picsum.photos/id/1082/400/300',
    duration: '2-3小时',
    ticketPrice: '90元'
  },
  {
    id: '2',
    name: '高北土楼群',
    distance: '5公里',
    description: '包含承启楼、世泽楼、五云楼等著名土楼，其中承启楼被誉为"土楼王"，是福建土楼中规模最大的一座。',
    image: 'https://picsum.photos/id/1048/400/300',
    duration: '2小时',
    ticketPrice: '50元'
  },
  {
    id: '3',
    name: '南溪土楼长城',
    distance: '8公里',
    description: '绵延十多公里的土楼群落，沿河分布着上百座形态各异的土楼，蔚为壮观，被誉为"土楼长城"。',
    image: 'https://picsum.photos/id/1040/400/300',
    duration: '3-4小时',
    ticketPrice: '45元'
  },
  {
    id: '4',
    name: '初溪土楼群',
    distance: '12公里',
    description: '坐落于半山腰的土楼群，由五座圆楼和数十座方楼组成，依山傍水，风景秀丽，是摄影爱好者的天堂。',
    image: 'https://picsum.photos/id/1038/400/300',
    duration: '2-3小时',
    ticketPrice: '70元'
  },
  {
    id: '5',
    name: '永定客家古镇',
    distance: '15公里',
    description: '以客家文化为主题的旅游古镇，有客家美食街、民俗表演、手工作坊等，是体验客家风情的好地方。',
    image: 'https://picsum.photos/id/1043/400/300',
    duration: '2小时',
    ticketPrice: '免费'
  },
  {
    id: '6',
    name: '龙湖风景区',
    distance: '20公里',
    description: '大型水库风景区，湖光山色，风景秀丽，可以乘船游湖、垂钓、烧烤，是休闲度假的好去处。',
    image: 'https://picsum.photos/id/1036/400/300',
    duration: '半天',
    ticketPrice: '30元'
  }
];
