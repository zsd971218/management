import Vue from 'vue'
Vue.filter('dateFormat', function (date) {
    const time = new Date(date)
    const y = time.getFullYear()
    const m = (time.getMonth() + 1 + '').padStart(2, '0')
    const d = (time.getDate() + '').padStart(2, '0')
    const hh = (time.getHours() + '').padStart(2, '0')
    const mm = (time.getMinutes() + '').padStart(2, '0')
    const ss = (time.getSeconds() + '').padStart(2, '0')
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
})