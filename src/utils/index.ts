export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(0)}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatFullDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekDay = (dateStr: string): string => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return weekDays[date.getDay()];
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: '可预订',
    booked: '已预订',
    pending: '待确认',
    maintenance: '维护中',
    confirmed: '已确认',
    checkedIn: '已入住',
    checkedOut: '已退房',
    cancelled: '已取消',
    refunded: '已退款',
    approved: '已同意',
    rejected: '已拒绝',
    completed: '已完成'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    available: '#5D7A6B',
    booked: '#D64545',
    pending: '#E8A33D',
    maintenance: '#9C8B7D',
    confirmed: '#5D7A6B',
    checkedIn: '#C4956A',
    checkedOut: '#9C8B7D',
    cancelled: '#D64545',
    refunded: '#9C8B7D',
    approved: '#5D7A6B',
    rejected: '#D64545',
    completed: '#5D7A6B'
  };
  return colorMap[status] || '#9C8B7D';
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

export const generateStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime > delay) {
      lastTime = now;
      fn(...args);
    }
  };
};
