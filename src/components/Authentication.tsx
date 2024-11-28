import React, { useState } from 'react';
import './styles.css';
import { IoChevronBack } from 'react-icons/io5';
import useWindowResize from './useWindowResize';

interface Props {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}
//style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}
const Authentication: React.FC<Props> = ({ setIsAuthenticated, setIsAdmin }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleResize = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth < 900) {
            const newScale = currentWidth / 900;
            return newScale;
        } else {
            return 1;
        }
    };

    const scale = useWindowResize(handleResize);

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
            localStorage.setItem('login', login); // Збереження логіну в localStorage
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
        <div className="authentication-container" style={{ transform: `scaleX(${1/scale})`, transformOrigin: 'top left'}}>
            <form className="authentication-form"  onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <h1>Вхід</h1>
                <input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="login-button" type="submit">увійти</button>
                {error && <div className="error">{error}</div>}
                <button className="back-button" onClick={() => setIsAdmin(false)}>
                    <span id="back_icon"><IoChevronBack /></span> назад
                </button>
            </form>
        </div>
    );
};

export default Authentication;