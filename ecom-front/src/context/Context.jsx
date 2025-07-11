import React, { createContext, useReducer, useEffect } from 'react'
import { reducer } from './Reducer';
import api from '../api';

export const GlobalContext = createContext("Initial Value");

let data = {
    user: {},
    isLogin: false
}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)

    useEffect(() => {
        // On app load, check if user is logged in via cookie
        api.get('/user-detail')
            .then(res => {
                if (res.data && res.data.user) {
                    dispatch({ type: "USER_LOGIN", user: res.data.user });
                }
            })
            .catch(() => {
                // Not logged in or token invalid, do nothing
            });
    }, []);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}