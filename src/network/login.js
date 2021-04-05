import request from './request';
export function getLoginInfo(data) {
    return request({
        url: '/login',
        method: 'post',
        data,
    })
}