import request from './request'
//查询订单数据列表
export function gainOrdersList(params) {
    return request({
        url: 'orders',
        method: 'get',
        params
    })
}
//修改订单数据列表
export function modifyOrder(id, data) {
    return request({
        url: 'orders/' + id,
        method: 'put',
        data
    })
}

