import React, { useState, useEffect, useRef } from 'react';
import Authentication from './Authentication';
import { IoChevronBack, IoChevronForward, IoChevronDown, IoChevronUp, IoClose } from 'react-icons/io5';
import useWindowResize from './useWindowResize';

interface Props {
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPanel: React.FC<Props> = ({ setIsAdmin }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
    const [isAccountMenuCollapsed, setIsAccountMenuCollapsed] = useState<boolean>(false);
    const [isManagementMenuCollapsed, setIsManagementMenuCollapsed] = useState<boolean>(false);
    const [adminName, setAdminName] = useState<string>('');
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isBlurred, setIsBlurred] = useState<boolean>(false);
    const scale = useWindowResize();

    const [selectedSemester, setSelectedSemester] = useState<number>(parseInt(localStorage.getItem('selectedSemester') || '1'));
    const [selectedWeek, setSelectedWeek] = useState<number>(parseInt(localStorage.getItem('selectedWeek') || '1'));

    const sectionWindowRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (sectionWindowRef.current && !sectionWindowRef.current.contains(event.target as Node)) {
                handleCloseSection();
            }
        };

        const addClickListener = () => {
            setTimeout(() => {
                document.addEventListener('click', handleDocumentClick);
            }, 100); 
        };

        const removeClickListener = () => {
            setTimeout(() => {
                document.removeEventListener('click', handleDocumentClick);
            }, 100); 
        };

        if (activeSection) {
            addClickListener();
        } else {
            removeClickListener();
        }

        return () => {
            removeClickListener();
        };
    }, [activeSection]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        setIsAuthenticated(false);
    };

    const handleCloseSection = () => {
        setActiveSection(null);
        setIsBlurred(false);
    };

    const handleSectionClick = (section: string) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
        setIsBlurred(true);
    };

    const handleSemesterChange = (semester: number) => {
        setSelectedSemester(semester);
        localStorage.setItem('selectedSemester', semester.toString());
    };

    const handleWeekChange = (week: number) => {
        setSelectedWeek(week);
        localStorage.setItem('selectedWeek', week.toString());
    };

    return (
        <>
            {isAuthenticated ? (
                <div className="admin-panel">
                    <div className={`sidebar ${isMenuCollapsed ? 'collapsed' : ''} ${isBlurred ? 'blurred' : ''}`}>
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
                                        <button onClick={() => { setActiveSection('schedule'); handleSectionClick('schedule'); }}>Розклад</button>
                                        <button onClick={() => { setActiveSection('objects'); handleSectionClick('objects'); }}>Предмети</button>
                                        <button onClick={() => { setActiveSection('groups'); handleSectionClick('groups'); }}>Групи</button>
                                        <button onClick={() => { setActiveSection('teachers'); handleSectionClick('teachers'); }}>Вчителі</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`main-content ${isBlurred ? 'blurred' : ''}`}>
                        <h1>Назва групи чи вчителя: {selectedSemester} семестр, {selectedWeek} тиждень</h1>
                        {/* Основна частина*/}
                    </div>
                    {activeSection && (
                        <div className="section-window" ref={sectionWindowRef} style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left', top: `${5 / scale}%` }}>
                            <button className="close-button" onClick={handleCloseSection}>
                                <IoClose />
                            </button>
                            <div className="section-content">
                                <div id="schedule" className={`section ${activeSection === 'schedule' ? 'active' : ''}`}>
                                    <h2>Розклад</h2>
                                    <div className="semester-week-selector">
                                        <div>
                                            <label>Семестр:</label>
                                            <select value={selectedSemester} onChange={(e) => handleSemesterChange(parseInt(e.target.value))}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Тиждень:</label>
                                            <select value={selectedWeek} onChange={(e) => handleWeekChange(parseInt(e.target.value))}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div id="objects" className={`section ${activeSection === 'objects' ? 'active' : ''}`}>
                                    <h2>Предмети</h2>
                                    {/* Контент для предметів */}
                                </div>
                                <div id="groups" className={`section ${activeSection === 'groups' ? 'active' : ''}`}>
                                    <h2>Групи</h2>
                                    {/* Контент для груп */}
                                </div>
                                <div id="teachers" className={`section ${activeSection === 'teachers' ? 'active' : ''}`}>
                                    <h2>Вчителі</h2>
                                    {/* Контент для вчителів */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Authentication setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )}
        </>
    );
};

export default AdminPanel;