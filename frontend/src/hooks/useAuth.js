import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import User from '../services/user'

export default function useAuth() {
    let history = useHistory()
    const { setAuth } = useContext(AuthContext)
    const [error, setError] = useState(null)

    const setUserContext = async () => {
        try {
            const { data } = await User.getInfo()
            if (data && 'data' in data) {
                setAuth(data.data)
                history.push('/')
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    const logoutUser = async () => {
        try {
            await User.logout()
            localStorage.clear()
        } catch (err) { }
    }

    const registerUser = async (body) => {
        try {
            const { data } = await User.register(body)
            if (data) {
                history.push('/login')
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    const loginUser = async (body) => {
        try {
            const { data } = await User.login(body)
            if (data && 'msg' in data && data.msg === 'Logged in!') {
                await setUserContext()
            } else {
                setError(data.error)
            }
        } catch (err) {
            if (err.response.status === 401)
                setError(err.response.data.message)
            else
                setError(err.message)
        }

    }

    return {
        registerUser,
        loginUser,
        logoutUser,
        error
    }

}