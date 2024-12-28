import { createContext, useContext } from "react";

export const AuthContext = createContext({
    userName: null,
    lastName: null,
    token: null,
    role: null,
    register: () => { },
    logout: () => { },
    isAuthenticated: false,
    setNewOrdersCount: () => { },
    newOrdersCount: 0
});

export const useAuth = () => useContext(AuthContext);
