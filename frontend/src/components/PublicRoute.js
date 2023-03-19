import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';

export default function PublicRoute(props) {
    const { auth, loading } = useContext(AuthContext);
    const { component: Component, ...rest } = props;

    if (loading) {
        return <></>
    }

    if (!auth) {
        return (<Route {...rest} render={(props) =>
            (<Component {...props} />)
        }
        />
        )
    }

    return <Redirect to='/' />
}