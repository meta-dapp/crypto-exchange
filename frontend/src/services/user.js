import {
    get,
    post,
    registerApi,
    loginApi,
    logoutApi,
    userInfoApi
} from '../api/http'

export default class User {
    static async register(body) {
        return await post(registerApi, body)
    }

    static async login(body) {
        return await post(loginApi, body)
    }

    static async logout() {
        return await post(logoutApi, {})
    }

    static async getInfo() {
        return await get(userInfoApi, {})
    }
}
