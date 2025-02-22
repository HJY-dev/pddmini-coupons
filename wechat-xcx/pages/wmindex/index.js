// miniprogram/pages/index/index.js
const app = getApp();
const tmplId = 'WzB5ckxWoAdTXNxOSmLWCQh_HbvhUIP17CxPCt52F0M';
const db = wx.cloud.database()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [],
        msg: {},
        activeTab: 0,
        notice: '领完券记得要收藏哦, 以便下次再领'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection('coupons').get().then(res => {
            const tabs = res.data
            console.log(tabs)

            let all = {
                title: '全部',
                icon: '../../images/all.png',
                coupon: []
            }

            tabs.forEach(item => {
                let c = item.coupon
                c.forEach(citem => {
                    all.coupon.push(citem)
                })
            })

            tabs.unshift(all)

            this.setData({ tabs })
        })

        db.collection('share-message').get().then(res => {
            const messages = res.data

            let idx = Math.floor(Math.random() * messages.length)

            this.data.msg = messages[idx]
            console.log('分享信息', this.data.msg)
        })

        db.collection('notice').get().then(res => {
            const notice = res.data
            if (notice[0]) this.setData({ notice: notice[0].notice })

            console.log('顶部轮播信息', this.data.notice);
        })
    },

    onChange(e) {
        console.log(e)
        console.log(this.data.activeTab)
        const index = e.detail.index
        this.setData({ activeTab: parseInt(index) })
    },

    toCoupon(e) {
        const couponIdx = e.currentTarget.dataset.index
        const wxappinfo = this.data.tabs[this.data.activeTab].coupon[couponIdx].minapp


        console.log('miniinfo', wxappinfo)

        wx.navigateToMiniProgram({
            appId: wxappinfo.appid,
            path: wxappinfo.path,
            success(res) {
                // 打开成功
                console.log('打开成功', res)
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    onSubscribe:function(){
        console.log('订阅')
        wx.requestSubscribeMessage({
          tmplIds: [tmplId],
          success(res){
            if (res.errMsg === 'requestSubscribeMessage:ok'){
              // 将订阅的信息调用云函数存入云开发数据
              wx.cloud
                .callFunction({
                  name: 'subscribe',
                  data: {
                    templateId: tmplId,
                  },
                })
                .then(() => {
                  wx.showToast({
                    title: '订阅成功',
                    icon: 'success',
                    duration: 2000,
                  });
                })
                .catch(() => {
                  wx.showToast({
                    title: '订阅失败',
                    icon: 'success',
                    duration: 2000,
                  });
                });
            }
          },
          fail(err){
            console.warn(err);
          }
        })
      },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: '这里有好多拼多多券饿了么美团外卖券滴滴花小猪打车券可以领取哦~',
            path: this.data.msg.path,
            imageUrl: this.data.msg.imageUrl,
        }
    },
    onShareTimeline: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '这里有好多拼多多券饿了么美团外卖券滴滴花小猪打车券可以领取哦~',
            query: '点外卖打车买东西领券多实惠省钱'
        }
    }
})