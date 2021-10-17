import React, { createContext } from 'react'

export const AuthContext = createContext({ isLogged: false, login: () => { }, logout: () => { } })
