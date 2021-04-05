import request from './request'
//获取商品分类数据列表
export function getCateList(params) {
    return request({
        url: '/categories',
        method: 'get',
        params
    })
}
//添加商品分类
export function addCateNode(data) {
    return request({
        url: '/categories',
        method: 'post',
        data
    })
}
//获取参数列表
export function getParamsList(id, type) {
    return request({
        url: '/categories/' + id + '/attributes',
        method: 'get',
        params: {
            sel: type
        }
    })
}
//添加动态参数或者静态属性
export function addParamsList(id, name, type) {
    return request({
        url: '/categories/' + id + '/attributes',
        method: 'post',
        data: {
            attr_name: name,
            attr_sel: type
        }
    })
}

//修改动态参数或者静态属性
export function editParamsList(pid, id, name, type, value) {
    return request({
        url: '/categories/' + pid + '/attributes/' + id,
        method: 'put',
        data: {
            attr_name: name,
            attr_sel: type,
            attr_vals: value
        }
    })
}
//删除动态参数或者静态属性
export function daleteParams(pid, id) {
    return request({
        url: '/categories/' + pid + '/attributes/' + id,
        method: 'delete',
    })
}
//获取商品列表数据
export function gainGoodsList(params) {
    return request({
        url: '/goods',
        method: 'get',
        params
    })
}
//添加商品请求
export function addGoods(data) {
    return request({
        url: '/goods',
        method: 'post',
        data
    })
}

//删除商品
export function deleteGoods(id) {
    return request({
        url: '/goods/' + id,
        method: 'delete'
    })
}
//删除分类
export function deleteCate(id) {
    return request({
        url: '/categories/' + id,
        method: 'delete'

    })
}