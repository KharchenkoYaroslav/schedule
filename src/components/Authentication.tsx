import React, { useState } from 'react';

interface Props {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Authentication: React.FC<Props> = ({ setIsAuthenticated}) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://schedule-server-rho.vercel.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, password }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            console.log(err);
        }
    };

    return (
        <div className="authentication">
            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Authentication;