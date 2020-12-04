
export default ($wx) => {
  const METHODS = ['get', 'post', 'put', 'delete','login','getUserInfo']

  let handler = {
    get (target, property) {
      target[property] = (url, params = {}) => {
        if ( property === 'login'){
          return new Promise((resolve, reject) => {
          $wx.login({
            success: res => {
              resolve(res)
            },
            fail: error => {
              reject(error)
            }
          })
        }) }
        if ( property === 'getUserInfo'){
          return new Promise((resolve, reject) => {
            $wx.getUserInfo({
              success: (res) => {

                resolve(res)
              },
              fail: (error) => {
                reject(error)
              }
            })

        }) }
        return new Promise((resolve, reject) => {
          $wx.request({
            url,
            method: property.toLocaleUpperCase(),
            ...params,
            success: res => {
              if (Number(res.statusCode) !== 200) {
                $wx.showToast({ title: '通讯错误，稍后再试', icon: 'none' })
                return false
              }

              resolve(res)
            },
            fail: error => {
              reject(error)
            }
          })
        })
      }
      return target[property]
    }
  }

  const API = new Proxy({}, handler)
  return API
}

