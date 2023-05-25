import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import axiosService from '../helpers/axiosHelper'

function useUserActions() {
    const navigate = useNavigate()
    const baseURL = process.env.REACT_APP_API_URL
    return {
        login,
        register,
        logout,
        edit,
    }

    function register(data) {
        return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
            setUserData(res.data)
            navigate('/')
        })
    }

    function login(data) {
        return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
            setUserData(res.data)
            navigate('/')
        })
    }

    function logout() {
        localStorage.removeItem('auth')
        navigate('/login')
    }

    function edit(data, userId) {
        return axiosService
            .patch(`/user/${userId}/`, data, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            })
            .then((res) => {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({
                        access: getAccessToken(),
                        refresh: getRefreshToken(),
                        user: res.data,
                    })
                )
            })
    }
}

function getUser() {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return auth?.user
}

function getAccessToken() {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return auth?.access
}

function getRefreshToken() {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return auth?.refresh
}

function setUserData(data) {
    localStorage.setItem(
        'auth',
        JSON.stringify({
            access: data.access,
            refresh: data.refresh,
            user: data.user,
        })
    )
}

export { useUserActions, getUser, getAccessToken, getRefreshToken, setUserData }
