import request from './request'

// 获取菜单栏
export function getMenu() {
    return request({
        url: '/menus',
        method: 'get'
    })
}
export function getUser(option) {
    return request({
        url: '/users',
        method: 'get',
        params: option
    })
}
export function modifyState(option) {
    return request({
        url: '/users/' + option.id + '/state/' + option.mg_state,
        method: 'put'
    })
}
export function addUser(option) {
    return request({
        url: '/users',
        method: 'post',
        data: option
    })
}
export function queryUser(id) {
    return request({
        url: '/users/' + id,
        method: 'get'
    })
}
export function alterUser(option) {
    return request({
        url: '/users/' + option.id,
        method: 'put',
        data: {
            id: option.id,
            email: option.email,
            mobile: option.mobile
        }

    })
}
//删除用户
export function deleteUser(id) {
    return request({
        url: '/users/' + id,
        method: 'delete'
    })
}
//获取所有角色列表
export function getRolesList() {
    return request({
        url: '/roles',
        method: 'get'
    })
}
//分配角色ID
export function setRole(uid, rid) {
    return request({
        url: '/users/' + uid + '/role',
        method: 'put',
        data: {
            rid
        }
    })
}