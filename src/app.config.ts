export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/tulou/index',
    'pages/experience/index',
    'pages/mine/index',
    'pages/dining/index',
    'pages/activity/index',
    'pages/refund/index',
    'pages/statistics/index',
    'pages/roomDetail/index',
    'pages/booking/index',
    'pages/review/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#C4956A',
    navigationBarTitleText: '土楼民宿',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF7F2'
  },
  tabBar: {
    color: '#9C8B7D',
    selectedColor: '#C4956A',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/tulou/index',
        text: '土楼'
      },
      {
        pagePath: 'pages/experience/index',
        text: '体验'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
