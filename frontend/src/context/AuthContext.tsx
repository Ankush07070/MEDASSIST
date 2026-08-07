import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

interface User {
    full_name: string;
    email: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(
    null
);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [user] = useState<User | null>(null);

    useEffect(() => {

        const storedToken =
            localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
        }

    }, []);

    function login(jwt: string) {

        localStorage.setItem("token", jwt);

        setToken(jwt);

    }

    function logout() {

        localStorage.removeItem("token");

        setToken(null);

    }

    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;

}