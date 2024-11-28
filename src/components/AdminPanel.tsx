import React, { useState, useEffect, useRef } from 'react';
import Authentication from './Authentication';
import { IoChevronBack, IoChevronForward, IoChevronDown, IoChevronUp, IoClose } from 'react-icons/io5';
import useWindowResize from './useWindowResize';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Group {
    group_code: string;
    specialty_id: number;
    number_of_students: number;
}

interface Teacher {
    id: number;
    full_name: string;
    department: string;
    post: string;
}

interface Specialty {
    id: number;
    specialty_name: string;
}

const AdminPanel: React.FC<Props> = ({ setIsAdmin }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
    const [isAccountMenuCollapsed, setIsAccountMenuCollapsed] = useState<boolean>(false);
    const [isManagementMenuCollapsed, setIsManagementMenuCollapsed] = useState<boolean>(false);
    const [adminName, setAdminName] = useState<string>('');
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isBlurred, setIsBlurred] = useState<boolean>(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(localStorage.getItem('selectedGroup') || null);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(localStorage.getItem('selectedTeacher') || null);
    const [newGroup, setNewGroup] = useState<Group>({ group_code: '', specialty_id: 0, number_of_students: 0 });
    const [newTeacher, setNewTeacher] = useState<Teacher>({ id: 0, full_name: '', department: '', post: 'Unknown' });
    const [selectedSemester, setSelectedSemester] = useState<number>(parseInt(localStorage.getItem('selectedSemester') || '1'));
    const [selectedWeek, setSelectedWeek] = useState<number>(parseInt(localStorage.getItem('selectedWeek') || '1'));
    const [isGroupSelected, setIsGroupSelected] = useState<boolean>(true);
    const [isEditingGroup, setIsEditingGroup] = useState<boolean>(false);
    const [isEditingTeacher, setIsEditingTeacher] = useState<boolean>(false);

    const scale = useWindowResize();
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
            fetchGroups();
            fetchTeachers();
            fetchSpecialties();
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

    const fetchGroups = async () => {
        try {
            const response = await fetch('https://schedule-server-rho.vercel.app/api/groups');
            const data = await response.json();
            setGroups(data);
        } catch (err) {
            console.error('Помилка отримання груп:', err);
            toast.error('Помилка отримання груп');
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await fetch('https://schedule-server-rho.vercel.app/api/teachers');
            const data = await response.json();
            setTeachers(data);
        } catch (err) {
            console.error('Помилка отримання вчителів:', err);
            toast.error('Помилка отримання вчителів');
        }
    };

    const fetchSpecialties = async () => {
        try {
            const response = await fetch('https://schedule-server-rho.vercel.app/api/specialties');
            const data = await response.json();
            setSpecialties(data);
        } catch (err) {
            console.error('Помилка отримання спеціальностей:', err);
            toast.error('Помилка отримання спеціальностей');
        }
    };

    const handleGroupSelect = (groupCode: string) => {
        if (groupCode === 'add') {
            setNewGroup({ group_code: '', specialty_id: 0, number_of_students: 0 });
            setIsEditingGroup(false);
        } else {
            const group = groups.find(g => g.group_code === groupCode);
            if (group) {
                setNewGroup(group);
                setIsEditingGroup(true);
            } else {
                setNewGroup({ group_code: '', specialty_id: 0, number_of_students: 0 });
                setIsEditingGroup(false);
            }
        }
        setSelectedGroup(groupCode === 'add' ? null : groupCode);
        localStorage.setItem('selectedGroup', groupCode === 'add' ? '' : groupCode);
        setIsGroupSelected(true); // Встановлюємо, що обрано групу
        setSelectedTeacher(null); // Скидаємо вибір вчителя
        localStorage.setItem('selectedTeacher', '');
    };
    
    const handleTeacherSelect = (teacherName: string) => {
        if (teacherName === 'add') {
            setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
            setIsEditingTeacher(false);
        } else {
            const teacher = teachers.find(t => t.full_name === teacherName);
            if (teacher) {
                setNewTeacher(teacher);
                setIsEditingTeacher(true);
            } else {
                setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
                setIsEditingTeacher(false);
            }
        }
        setSelectedTeacher(teacherName === 'add' ? null : teacherName);
        localStorage.setItem('selectedTeacher', teacherName === 'add' ? '' : teacherName);
        setIsGroupSelected(false); // Встановлюємо, що обрано вчителя
        setSelectedGroup(null); // Скидаємо вибір групи
        localStorage.setItem('selectedGroup', '');
    };

    const addGroup = async () => {
        try {
            const response = await fetch('https://schedule-server-rho.vercel.app/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });
            if (response.ok) {
                fetchGroups();
                setNewGroup({ group_code: '', specialty_id: 0, number_of_students: 0 });
                setSelectedGroup(null); // Скидання обраної групи
                toast.success('Група додана успішно');
            } else {
                const errorData = await response.text();
                toast.error(errorData);
            }
        } catch (err) {
            console.error('Помилка додавання групи:', err);
            toast.error('Помилка додавання групи');
        }
    };

    const updateGroup = async () => {
        try {
            const response = await fetch(`https://schedule-server-rho.vercel.app/api/groups/${newGroup.group_code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });
            if (response.ok) {
                fetchGroups();
                setNewGroup({ group_code: '', specialty_id: 0, number_of_students: 0 });
                setIsEditingGroup(false);
                setSelectedGroup(null); // Скидання обраної групи
                toast.success('Група оновлена успішно');
            } else {
                const errorData = await response.text();
                toast.error(errorData);
            }
        } catch (err) {
            console.error('Помилка оновлення групи:', err);
            toast.error('Помилка оновлення групи');
        }
    };

    const deleteGroup = async (groupCode: string) => {
        try {
            const response = await fetch(`https://schedule-server-rho.vercel.app/api/groups/${groupCode}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchGroups();
                setSelectedGroup(null);
                setIsEditingGroup(false);
                toast.success('Група видалена успішно');
            } else {
                const errorData = await response.text();
                toast.error(errorData);
            }
        } catch (err) {
            console.error('Помилка видалення групи:', err);
            toast.error('Помилка видалення групи');
        }
    };

    const addTeacher = async () => {
        try {
            const response = await fetch('https://schedule-server-rho.vercel.app/api/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTeacher),
            });
            if (response.ok) {
                fetchTeachers();
                setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
                setSelectedTeacher(null);
                toast.success('Вчитель доданий успішно');
            } else {
                const errorData = await response.text();
                toast.error(errorData);
            }
        } catch (err) {
            console.error('Помилка додавання вчителя:', err);
            toast.error('Помилка додавання вчителя');
        }
    };

    const updateTeacher = async () => {
        try {
            const response = await fetch(`https://schedule-server-rho.vercel.app/api/teachers/${newTeacher.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTeacher),
            });
            if (response.ok) {
                fetchTeachers();
                setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
                setIsEditingTeacher(false);
                setSelectedTeacher(null);
                toast.success('Вчитель оновлений успішно');
            } else {
                const errorData = await response.text();
                toast.error(errorData);
            }
        } catch (err) {
            console.error('Помилка оновлення вчителя:', err);
            toast.error('Помилка оновлення вчителя');
        }
    };

    const deleteTeacher = async (teacherId: number) => {
        try {
            const response = await fetch(`https://schedule-server-rho.vercel.app/api/teachers/${teacherId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchTeachers();
                setSelectedTeacher(null);
                setIsEditingTeacher(false);
                toast.success('Вчитель видалений успішно');
            } else {
                const errorData = await response.text();
                toast.error(errorData);
            }
        } catch (err) {
            console.error('Помилка видалення вчителя:', err);
            toast.error('Помилка видалення вчителя');
        }
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
                        <h1>
                            {selectedGroup || selectedTeacher ? (
                                <>
                                    {selectedGroup && `Група: ${selectedGroup}`}
                                    {selectedTeacher && `Вчитель: ${selectedTeacher}`}
                                    <br />
                                    Семестр: {selectedSemester}, Тиждень: {selectedWeek}
                                </>
                            ) : (
                                "Оберіть розклад"
                            )}
                        </h1>
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
                                    <select value={selectedGroup || ''} onChange={(e) => handleGroupSelect(e.target.value)}>
                                        <option value="">Оберіть групу</option>
                                        <option value="add">Додати групу</option>
                                        {groups.map(group => (
                                            <option key={group.group_code} value={group.group_code}>{group.group_code}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Ім'я групи"
                                        value={newGroup.group_code}
                                        onChange={(e) => setNewGroup({ ...newGroup, group_code: e.target.value })}
                                    />
                                    <select
                                        value={newGroup.specialty_id}
                                        onChange={(e) => setNewGroup({ ...newGroup, specialty_id: parseInt(e.target.value) })}
                                    >
                                        <option value="">Оберіть спеціальність</option>
                                        {specialties.map(specialty => (
                                            <option key={specialty.id} value={specialty.id}>{specialty.specialty_name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Кількість студентів"
                                        value={newGroup.number_of_students === 0 ? '' : newGroup.number_of_students}
                                        onChange={(e) => setNewGroup({ ...newGroup, number_of_students: parseInt(e.target.value) || 0 })}
                                    />
                                    {isEditingGroup ? (
                                        <button onClick={updateGroup}>Редагувати групу</button>
                                    ) : (
                                        <button onClick={addGroup}>Додати групу</button>
                                    )}
                                    {selectedGroup && (
                                        <button className='delete' onClick={() => deleteGroup(selectedGroup)}>Видалити групу</button>
                                    )}
                                </div>
                                <div id="teachers" className={`section ${activeSection === 'teachers' ? 'active' : ''}`}>
                                    <h2>Вчителі</h2>
                                    <select value={selectedTeacher || ''} onChange={(e) => handleTeacherSelect(e.target.value)}>
                                        <option value="">Оберіть вчителя</option>
                                        <option value="add">Додати вчителя</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.full_name}>{teacher.full_name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Ім'я вчителя"
                                        value={newTeacher.full_name}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Факультет"
                                        value={newTeacher.department}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                                    />
                                    <select
                                        value={newTeacher.post}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, post: e.target.value })}
                                    >
                                        <option value="Unknown">Невідомо</option>
                                        <option value="Assistant">Асистент</option>
                                        <option value="Teacher">Викладач</option>
                                        <option value="Senior_teacher">Старший викладач</option>
                                        <option value="Docent">Доцент</option>
                                        <option value="Professor">Професор</option>
                                    </select>
                                    {isEditingTeacher ? (
                                        <button onClick={updateTeacher}>Редагувати вчителя</button>
                                    ) : (
                                        <button onClick={addTeacher}>Додати вчителя</button>
                                    )}
                                    {selectedTeacher && (
                                        <button className='delete' onClick={() => deleteTeacher(teachers.find(teacher => teacher.full_name === selectedTeacher)?.id || 0)}>Видалити вчителя</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <ToastContainer />
                </div>
            ) : (
                <Authentication setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )}
        </>
    );
};

export default AdminPanel;