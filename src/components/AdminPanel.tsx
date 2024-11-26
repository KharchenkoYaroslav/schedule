import React, { useState, useEffect } from 'react';
import Authentication from './Authentication';
import { IoChevronBack, IoChevronForward, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import useWindowResize from './useWindowResize';

interface Props {
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPanel: React.FC<Props> = ({ setIsAdmin }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [isAccountMenuCollapsed, setIsAccountMenuCollapsed] = useState(false);
    const [isManagementMenuCollapsed, setIsManagementMenuCollapsed] = useState(false);
    const [adminName, setAdminName] = useState('');
    const scale = useWindowResize();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchAdminName = async () => {
                try {
                    const login = localStorage.getItem('login');
                    if (!login) {
                        throw new Error('Логін адміністратора не знайдений');
                    }

                    const response = await fetch('https://schedule-server-rho.vercel.app/api/getAdminName', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ login })
                    });

                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(errorData);
                    }

                    const data = await response.json();
                    setAdminName(data.full_name);
                } catch (err) {
                    console.error('Помилка отримання імені адміністратора:', err);
                }
            };

            fetchAdminName();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        setIsAuthenticated(false);
    };

    return (
        <>
            {isAuthenticated ? (
                <div className="admin-panel" >
                    <div className={`sidebar ${isMenuCollapsed ? 'collapsed' : ''}`}>
                        <button className="collapse-button" onClick={() => setIsMenuCollapsed(!isMenuCollapsed)} style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>
                            {!isMenuCollapsed && <span className="admin-name" title={adminName}>{adminName}</span>}
                            {isMenuCollapsed ? <IoChevronForward /> : <IoChevronBack />}
                        </button>
                        {!isMenuCollapsed && (
                            <div className="menu-container" style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>
                                <div className="account-menu">
                                    <h3 onClick={() => setIsAccountMenuCollapsed(!isAccountMenuCollapsed)}>
                                        Меню акаунту {isAccountMenuCollapsed ? <IoChevronDown /> : <IoChevronUp />}
                                    </h3>
                                    <div className={`menu-content ${isAccountMenuCollapsed ? 'collapsed' : ''}`}>
                                        <button onClick={handleLogout}>Вийти з акаунта</button>
                                        <button onClick={() => setIsAdmin(false)}>На головну</button>
                                    </div>
                                </div>
                                <div className="management-menu">
                                    <h3 onClick={() => setIsManagementMenuCollapsed(!isManagementMenuCollapsed)}>
                                        Меню керування {isManagementMenuCollapsed ? <IoChevronDown /> : <IoChevronUp />}
                                    </h3>
                                    <div className={`menu-content ${isManagementMenuCollapsed ? 'collapsed' : ''}`}>
                                        {/* Додайте елементи меню керування тут */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="main-content">
                        {/* Основна частина, яка залишається порожньою */}
                    </div>
                </div>
            ) : (
                <Authentication setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )}
        </>
    );
};

export default AdminPanel;