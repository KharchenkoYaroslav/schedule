import React, { useState, useEffect, useRef } from 'react';
import Authentication from './Authentication';
import useWindowResize from './useWindowResize';
import { IoChevronBack, IoChevronForward, IoChevronDown, IoChevronUp, IoClose, IoAdd, IoRemove } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Curriculum, Group, Specialty, Teacher } from './adminStructure';
import {
    fetchGroups,
    fetchTeachers,
    fetchSpecialties,
    fetchCurriculums,
    addGroup,
    updateGroup,
    deleteGroup,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum
} from './adminDataManagement';

interface Props {
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPanel: React.FC<Props> = ({ setIsAdmin }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
    const [isAccountMenuCollapsed, setIsAccountMenuCollapsed] = useState<boolean>(false);
    const [isManagementMenuCollapsed, setIsManagementMenuCollapsed] = useState<boolean>(false);
    const [adminName, setAdminName] = useState<string>('');
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isBlurred, setIsBlurred] = useState<boolean>(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
    const [newGroup, setNewGroup] = useState<Group>({ group_code: '', specialty_id: 0, number_of_students: 0 });
    const [newTeacher, setNewTeacher] = useState<Teacher>({ id: 0, full_name: '', department: '', post: 'Unknown' });
    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [selectedWeek, setSelectedWeek] = useState<number>(1);
    const [isGroupSelected, setIsGroupSelected] = useState<boolean>(true);
    const [isEditingGroup, setIsEditingGroup] = useState<boolean>(false);
    const [isEditingTeacher, setIsEditingTeacher] = useState<boolean>(false);
    const [filterGroupName, setFilterGroupName] = useState<string>('');
    const [filterTeacherName, setFilterTeacherName] = useState<string>('');

    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
    const [newCurriculum, setNewCurriculum] = useState<Curriculum>({
        id: 0,
        subject_name: '',
        related_teachers: [],
        related_groups: [],
        correspondence: false
    });
    const [isEditingCurriculum, setIsEditingCurriculum] = useState<boolean>(false);
    const [filterCurriculumName, setFilterCurriculumName] = useState<string>('');
    const [isTeachersCollapsed, setIsTeachersCollapsed] = useState<boolean>(false);
    const [isGroupsCollapsed, setIsGroupsCollapsed] = useState<boolean>(false);

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
            fetchGroups().then(setGroups).catch(() => toast.error('Помилка отримання груп'));
            fetchTeachers().then(setTeachers).catch(() => toast.error('Помилка отримання вчителів'));
            fetchSpecialties().then(setSpecialties).catch(() => toast.error('Помилка отримання спеціальностей'));
            fetchCurriculums().then(setCurriculums).catch(() => toast.error('Помилка отримання предметів'));
        }
    }, [isAuthenticated]);

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
        setIsGroupSelected(true);
        setSelectedTeacher(null);
        localStorage.setItem('selectedTeacher', '');
    };

    const handleTeacherSelect = (teacherId: number) => {
        if (teacherId === 0) {
            setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
            setIsEditingTeacher(false);
        } else {
            const teacher = teachers.find(t => t.id === teacherId);
            if (teacher) {
                setNewTeacher(teacher);
                setIsEditingTeacher(true);
            } else {
                setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
                setIsEditingTeacher(false);
            }
        }
        setSelectedTeacher(teacherId === 0 ? null : teacherId);
        localStorage.setItem('selectedTeacher', teacherId === 0 ? '' : teacherId.toString());
        setIsGroupSelected(false);
        setSelectedGroup(null);
        localStorage.setItem('selectedGroup', '');
    };

    const handleCurriculumSelect = (curriculumId: number) => {
        if (curriculumId === 0) {
            setNewCurriculum({
                id: 0,
                subject_name: '',
                related_teachers: [],
                related_groups: [],
                correspondence: false
            });
            setIsEditingCurriculum(false);
            setSelectedCurriculum(null);
        } else {
            const curriculum = curriculums.find(c => c.id === curriculumId);
            if (curriculum) {
                setNewCurriculum(curriculum);
                setIsEditingCurriculum(true);
                setSelectedCurriculum(curriculum);
            } else {
                setNewCurriculum({
                    id: 0,
                    subject_name: '',
                    related_teachers: [],
                    related_groups: [],
                    correspondence: false
                });
                setIsEditingCurriculum(false);
                setSelectedCurriculum(null);
            }
        }
    };

    const handleAddGroup = async () => {
        try {
            await addGroup(newGroup);
            fetchGroups().then(setGroups).catch(() => toast.error('Помилка отримання груп'));
            setNewGroup({ group_code: '', specialty_id: 0, number_of_students: 0 });
            setSelectedGroup(null);
            toast.success('Група додана успішно');
        } catch (err) {
            toast.error('Помилка додавання групи');
        }
    };

    const handleUpdateGroup = async () => {
        try {
            await updateGroup(newGroup.group_code, newGroup);
            fetchGroups().then(setGroups).catch(() => toast.error('Помилка отримання груп'));
            setNewGroup({ group_code: '', specialty_id: 0, number_of_students: 0 });
            setIsEditingGroup(false);
            setSelectedGroup(null);
            toast.success('Група оновлена успішно');
        } catch (err) {
            toast.error('Помилка оновлення групи');
        }
    };

    const handleDeleteGroup = async (groupCode: string) => {
        try {
            await deleteGroup(groupCode);
            fetchGroups().then(setGroups).catch(() => toast.error('Помилка отримання груп'));
            setSelectedGroup(null);
            setIsEditingGroup(false);
            toast.success('Група видалена успішно');
        } catch (err) {
            toast.error('Помилка видалення групи');
        }
    };

    const handleAddTeacher = async () => {
        try {
            await addTeacher(newTeacher);
            fetchTeachers().then(setTeachers).catch(() => toast.error('Помилка отримання вчителів'));
            setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
            setSelectedTeacher(null);
            toast.success('Вчитель доданий успішно');
        } catch (err) {
            toast.error('Помилка додавання вчителя');
        }
    };

    const handleUpdateTeacher = async () => {
        try {
            await updateTeacher(newTeacher.id, newTeacher);
            fetchTeachers().then(setTeachers).catch(() => toast.error('Помилка отримання вчителів'));
            setNewTeacher({ id: 0, full_name: '', department: '', post: 'Unknown' });
            setIsEditingTeacher(false);
            setSelectedTeacher(null);
            toast.success('Вчитель оновлений успішно');
        } catch (err) {
            toast.error('Помилка оновлення вчителя');
        }
    };

    const handleDeleteTeacher = async (teacherId: number) => {
        try {
            await deleteTeacher(teacherId);
            fetchTeachers().then(setTeachers).catch(() => toast.error('Помилка отримання вчителів'));
            setSelectedTeacher(null);
            setIsEditingTeacher(false);
            toast.success('Вчитель видалений успішно');
        } catch (err) {
            toast.error('Помилка видалення вчителя');
        }
    };

    const handleAddCurriculum = async () => {
        try {
            await addCurriculum(newCurriculum);
            fetchCurriculums().then(setCurriculums).catch(() => toast.error('Помилка отримання предметів'));
            setNewCurriculum({
                id: 0,
                subject_name: '',
                related_teachers: [],
                related_groups: [],
                correspondence: false
            });
            setSelectedCurriculum(null);
            toast.success('Предмет доданий успішно');
        } catch (err) {
            toast.error('Помилка додавання предмету');
        }
    };

    const handleUpdateCurriculum = async () => {
        try {
            await updateCurriculum(newCurriculum.id, newCurriculum);
            fetchCurriculums().then(setCurriculums).catch(() => toast.error('Помилка отримання предметів'));
            setNewCurriculum({
                id: 0,
                subject_name: '',
                related_teachers: [],
                related_groups: [],
                correspondence: false
            });
            setIsEditingCurriculum(false);
            setSelectedCurriculum(null);
            toast.success('Предмет оновлений успішно');
        } catch (err) {
            toast.error('Помилка оновлення предмету');
        }
    };

    const handleDeleteCurriculum = async (curriculumId: number) => {
        try {
            await deleteCurriculum(curriculumId);
            fetchCurriculums().then(setCurriculums).catch(() => toast.error('Помилка отримання предметів'));
            setSelectedCurriculum(null);
            setIsEditingCurriculum(false);
            toast.success('Предмет видалений успішно');
        } catch (err) {
            toast.error('Помилка видалення предмету');
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

    const getTeacherDisplayName = (teacher: Teacher) => {
        return `${teacher.full_name} (${teacher.id})`;
    };

    const filteredGroups = groups.filter(group =>
        group.group_code.toLowerCase().includes(filterGroupName.toLowerCase())
    );

    const filteredTeachers = teachers.filter(teacher =>
        teacher.full_name.toLowerCase().includes(filterTeacherName.toLowerCase())
    );

    const filteredCurriculums = curriculums.filter(curriculum =>
        curriculum.subject_name.toLowerCase().includes(filterCurriculumName.toLowerCase())
    );

    const addTeacherToCurriculum = () => {
        setNewCurriculum({
            ...newCurriculum,
            related_teachers: [
                ...newCurriculum.related_teachers,
                {
                    id: '',
                    planned_labs: 0,
                    planned_lectures: 0,
                    planned_practicals: 0,
                }
            ]
        });
    };

    const removeTeacherFromCurriculum = (index: number) => {
        const updatedTeachers = [...newCurriculum.related_teachers];
        updatedTeachers.splice(index, 1);
        setNewCurriculum({
            ...newCurriculum,
            related_teachers: updatedTeachers
        });
    };

    const addGroupToCurriculum = () => {
        setNewCurriculum({
            ...newCurriculum,
            related_groups: [
                ...newCurriculum.related_groups,
                {
                    code: '',
                    planned_labs: 0,
                    scheduled_labs: 0,
                    planned_lectures: 0,
                    planned_practicals: 0,
                    scheduled_lectures: 0,
                    scheduled_practicals: 0
                }
            ]
        });
    };

    const removeGroupFromCurriculum = (index: number) => {
        const updatedGroups = [...newCurriculum.related_groups];
        updatedGroups.splice(index, 1);
        setNewCurriculum({
            ...newCurriculum,
            related_groups: updatedGroups
        });
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
                                    {selectedTeacher && `Вчитель: ${teachers.find(t => t.id === selectedTeacher)?.full_name}`}
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
                                    <select value={selectedCurriculum ? selectedCurriculum.id : ''} onChange={(e) => handleCurriculumSelect(parseInt(e.target.value))}>
                                        <option value="">Оберіть предмет</option>
                                        <option value="0">Додати предмет</option>
                                        {filteredCurriculums.map(curriculum => (
                                            <option key={curriculum.id} value={curriculum.id}>{curriculum.subject_name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Фільтр за назвою предмету"
                                        value={filterCurriculumName}
                                        onChange={(e) => setFilterCurriculumName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Назва предмету"
                                        value={newCurriculum.subject_name}
                                        onChange={(e) => setNewCurriculum({ ...newCurriculum, subject_name: e.target.value })}
                                    />
                                    <label>
                                        {selectedCurriculum ? (selectedCurriculum.correspondence ? `Розклад відповідає навчальному плану` : `Розклад не відповідає навчальному плану`) : ''}
                                    </label>
                                    <div>
                                        <button className='setIsCollapsed' onClick={() => setIsTeachersCollapsed(!isTeachersCollapsed)}>
                                            <h3 >
                                                Пов'язані вчителі {isTeachersCollapsed ? <IoChevronDown /> : <IoChevronUp />}
                                            </h3>
                                        </button>
                                        <div className={`teachersCurriculum ${isTeachersCollapsed ? 'collapsed' : ''}`}>
                                            {newCurriculum.related_teachers.map((teacher, index) => (
                                                <div key={index}>
                                                    <input
                                                        type="text"
                                                        placeholder="ID вчителя"
                                                        value={teacher.id}
                                                        onChange={(e) => {
                                                            const updatedTeachers = [...newCurriculum.related_teachers];
                                                            updatedTeachers[index].id = e.target.value;
                                                            setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Заплановані лекції"
                                                        min="0"
                                                        value={teacher.planned_lectures === 0 ? '' : teacher.planned_lectures}
                                                        onChange={(e) => {
                                                            const updatedTeachers = [...newCurriculum.related_teachers];
                                                            updatedTeachers[index].planned_lectures = parseInt(e.target.value);
                                                            setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Заплановані практики"
                                                        min="0"
                                                        value={teacher.planned_practicals === 0 ? '' : teacher.planned_practicals}
                                                        onChange={(e) => {
                                                            const updatedTeachers = [...newCurriculum.related_teachers];
                                                            updatedTeachers[index].planned_practicals = parseInt(e.target.value);
                                                            setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Заплановані лабораторні"
                                                        min="0"
                                                        value={teacher.planned_labs === 0 ? '' : teacher.planned_labs}
                                                        onChange={(e) => {
                                                            const updatedTeachers = [...newCurriculum.related_teachers];
                                                            updatedTeachers[index].planned_labs = parseInt(e.target.value);
                                                            setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                        }}
                                                    />
                                                    <button className='delete' onClick={() => removeTeacherFromCurriculum(index)}>
                                                        <IoRemove /> Прибрати вчителя
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={addTeacherToCurriculum}>
                                                <IoAdd /> Додати вчителя
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <button className='setIsCollapsed' onClick={() => setIsGroupsCollapsed(!isGroupsCollapsed)}>
                                            <h3>
                                                Пов'язані групи {isGroupsCollapsed ? <IoChevronDown /> : <IoChevronUp />}
                                            </h3>
                                        </button>
                                        <div className={`groupsCurriculum ${isGroupsCollapsed ? 'collapsed' : ''}`}>
                                            {newCurriculum.related_groups.map((group, index) => (
                                                <div key={index}>
                                                    <input
                                                        type="text"
                                                        placeholder="Код групи"
                                                        value={group.code}
                                                        onChange={(e) => {
                                                            const updatedGroups = [...newCurriculum.related_groups];
                                                            updatedGroups[index].code = e.target.value;
                                                            setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Заплановані лекції"
                                                        min="0"
                                                        value={group.planned_lectures === 0 ? '' : group.planned_lectures}
                                                        onChange={(e) => {
                                                            const updatedGroups = [...newCurriculum.related_groups];
                                                            updatedGroups[index].planned_lectures = parseInt(e.target.value);
                                                            setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Заплановані практики"
                                                        min="0"
                                                        value={group.planned_practicals === 0 ? '' : group.planned_practicals}
                                                        onChange={(e) => {
                                                            const updatedGroups = [...newCurriculum.related_groups];
                                                            updatedGroups[index].planned_practicals = parseInt(e.target.value);
                                                            setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Заплановані лабораторні"
                                                        min="0"
                                                        value={group.planned_labs === 0 ? '' : group.planned_labs}
                                                        onChange={(e) => {
                                                            const updatedGroups = [...newCurriculum.related_groups];
                                                            updatedGroups[index].planned_labs = parseInt(e.target.value);
                                                            setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                        }}
                                                    />
                                                    <button className='delete' onClick={() => removeGroupFromCurriculum(index)}>
                                                        <IoRemove /> Прибрати групу
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={addGroupToCurriculum}>
                                                <IoAdd /> Додати групу
                                            </button>
                                        </div>
                                    </div>
                                    {isEditingCurriculum ? (
                                        <button onClick={handleUpdateCurriculum}>Редагувати предмет</button>
                                    ) : (
                                        <button id='addCurriculum' onClick={handleAddCurriculum}>Додати предмет</button>
                                    )}
                                    {selectedCurriculum && (
                                        <button className='delete' onClick={() => handleDeleteCurriculum(selectedCurriculum.id)}>Видалити предмет</button>
                                    )}
                                </div>
                                <div id="groups" className={`section ${activeSection === 'groups' ? 'active' : ''}`}>
                                    <h2>Групи</h2>
                                    <select value={selectedGroup || ''} onChange={(e) => handleGroupSelect(e.target.value)}>
                                        <option value="">Оберіть групу</option>
                                        <option value="add">Додати групу</option>
                                        {filteredGroups.map(group => (
                                            <option key={group.group_code} value={group.group_code}>{group.group_code}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Фільтр за назвою групи"
                                        value={filterGroupName}
                                        onChange={(e) => setFilterGroupName(e.target.value)}
                                    />
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
                                        <button onClick={handleUpdateGroup}>Редагувати групу</button>
                                    ) : (
                                        <button onClick={handleAddGroup}>Додати групу</button>
                                    )}
                                    {selectedGroup && (
                                        <button className='delete' onClick={() => handleDeleteGroup(selectedGroup)}>Видалити групу</button>
                                    )}
                                </div>
                                <div id="teachers" className={`section ${activeSection === 'teachers' ? 'active' : ''}`}>
                                    <h2>Вчителі</h2>
                                    <select value={selectedTeacher || ''} onChange={(e) => handleTeacherSelect(parseInt(e.target.value))}>
                                        <option value="">Оберіть вчителя</option>
                                        <option value="0">Додати вчителя</option>
                                        {filteredTeachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{getTeacherDisplayName(teacher)}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Фільтр за іменем вчителя"
                                        value={filterTeacherName}
                                        onChange={(e) => setFilterTeacherName(e.target.value)}
                                    />
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
                                        <button onClick={handleUpdateTeacher}>Редагувати вчителя</button>
                                    ) : (
                                        <button onClick={handleAddTeacher}>Додати вчителя</button>
                                    )}
                                    {selectedTeacher && (
                                        <button className='delete' onClick={() => handleDeleteTeacher(selectedTeacher)}>Видалити вчителя</button>
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