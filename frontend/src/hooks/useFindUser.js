import { useState, useEffect } from 'react';
import User from '../services/user'

export default function useFindUser() {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function findUser() {
            try {
                const { data } = await User.getInfo()
                if (data && 'data' in data)
                    setAuth(data.data)
            } catch (err) { }

            setLoading(false);
        }

        findUser()
    }, [])


    return {
        auth,
        loading,
        setAuth
    }
}