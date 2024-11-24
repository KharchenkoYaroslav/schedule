import React, { useState } from 'react';
import Authentication from './Authentication';
import { IoChevronBack } from 'react-icons/io5';

interface Props {
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPanel: React.FC<Props> = ({ setIsAdmin }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <div className="admin-panel">
            {!isAuthenticated ? (
                    <Authentication setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin}/>
            ) : (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => setIsAdmin(false)}>
                        <span id="back_icon"><IoChevronBack /></span> назад
                    </button>
                    {/* Додайте інші функції адміністратора тут */}
                </>
            )}
        </div>
    );
};

export default AdminPanel;