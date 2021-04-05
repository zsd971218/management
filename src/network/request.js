import axios from 'axios';
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
export default function request(option) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1',
        timeout: 5000
    })

    //配置请求拦截器
    instance.interceptors.request.use((config) => {

        Nprogress.start()
        const token = window.sessionStorage.getItem('token');
        config.headers.authorization = token;
        return config
    }, (err) => { console.log(err); })
    //配置响应拦截器
    instance.interceptors.response.use((config) => {

        Nprogress.done()
        return config.data
    }, (err) => { console.log(err); })
    //返回instance对象
    return instance(option);
}
