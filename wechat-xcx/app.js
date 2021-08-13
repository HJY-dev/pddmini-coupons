
//app.js

App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-9gc9esj5ea9ac5de',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})