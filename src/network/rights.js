import request from './request'
export function getRightsData() {
    return request({
        url: '/rights/list',
        method: 'get'
    })
}
export function getRolesData() {
    return request({
        url: '/roles',
        method: 'get'
    })
}
export function removeRight(pm1, pm2) {
    return request({
        url: '/roles/' + pm1.id + '/rights/' + pm2,
        method: 'delete'
    })
}
export function getAllRights() {
    return request({
        url: 'rights/tree',
        method: 'get'
    })
}
export function editRights(id, str) {
    return request({
        url: '/roles/' + id + '/rights',
        method: 'post',
        data: {
            rids: str
        }
    })
}
//添加角色
export function addRole(data) {
    return request({
        url: '/roles',
        method: 'post',
        data
    })
}
//删除角色
export function deleteRole(id) {
    return request({
        url: '/roles/' + id,
        method: 'delete',

    })
}