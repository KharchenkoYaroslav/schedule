import React, { useState, useEffect, useRef } from 'react';
import Authentication from './Authentication';
import useWindowResize from './useWindowResize';
import { IoChevronBack, IoChevronForward, IoChevronDown, IoChevronUp, IoClose, IoAdd, IoRemove } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Curriculum, Group, Specialty, Teacher, Pair } from './adminStructure';
import useLocalStorage from './useLocalStorage';
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
    deleteCurriculum,
    addPair,
    editPair,
    deletePair,
    getPairsByCriteria,
    updateGroups,
    fetchNullGroups
} from './adminDataManagement';
import MainAdminContent from './mainAdminContent';

interface Props {
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminTable: React.FC<Props> = ({ setIsAdmin }) => {
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
    const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
    const [isAccountMenuCollapsed, setIsAccountMenuCollapsed] = useState<boolean>(false);
    const [isManagementMenuCollapsed, setIsManagementMenuCollapsed] = useState<boolean>(false);
    const [isInstructionCollapsed, setIsInstructionCollapsed] = useState<boolean>(false);
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


    const scale = useWindowResize();
    const sectionWindowRef = useRef<HTMLDivElement | null>(null);

    const [pairParams, setPairParams] = useState<{ pairIndex: number; dayIndex: number; weekIndex: number } | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [lessonType, setLessonType] = useState<'Lecture' | 'Practice' | 'Laboratory'>('Lecture');
    const [visitFormat, setVisitFormat] = useState<'Offline' | 'Online'>('Offline');
    const [audience, setAudience] = useState<number | null>(null);
    const [pairs, setPairs] = useState<Pair[]>([]);
    const [mismatchedCurriculumsString, setMismatchedCurriculumsString] = useState<string>('');
    const [filterTeacherNameCurriculum, setFilterTeacherNameCurriculum] = useState<string>('');

    const pairsRef = useRef<Pair[]>(pairs);
    useEffect(() => {
        pairsRef.current = pairs;
    }, [pairs]);


    const [nullGroupsString, setNullGroupsString] = useState<string>('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchNullGroups().then(setNullGroupsString).catch(() => toast.error('Помилка отримання груп з нульовою кількістю студентів'));
        }
    }, [isAuthenticated, groups]);

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

    useEffect(() => {
        const fetchPairs = async () => {
            if (pairParams) {
                try {
                    const criteria = {
                        semester: selectedSemester,
                        groupId: selectedGroup,
                        teacherId: selectedTeacher,
                        weekNumber: pairParams.weekIndex + 1,
                        dayNumber: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][pairParams.dayIndex],
                        pairNumber: pairParams.pairIndex + 1,
                    };
                    const fetchedPairs = await getPairsByCriteria(criteria);

                    setPairs(fetchedPairs);
                } catch (err) {
                    toast.error('Помилка отримання пар');
                }
            }
        };

        fetchPairs();
    }, [selectedSemester, selectedGroups, selectedTeachers, pairParams]);


    useEffect(() => {
        if (isAuthenticated) {
            const mismatchedCurriculums = curriculums.filter(curriculum => !curriculum.correspondence);

            const mismatchedCurriculumsString = mismatchedCurriculums.map(curriculum => curriculum.subject_name).join(', ');

            setMismatchedCurriculumsString(mismatchedCurriculumsString);
        }
    }, [isAuthenticated, curriculums]);

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
        if (!selectedGroup) {
            toast.error('Група не вибрана');
            return;
        }
        try {
            await updateGroup(selectedGroup, newGroup);
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

    const handlePairClick = (pairIndex: number, dayIndex: number, weekIndex: number) => {
        setPairParams({ pairIndex, dayIndex, weekIndex });
        setActiveSection('pair');
        handleSectionClick('pair');
    };

    const handleAddPair = () => {
        if (!selectedSubject) {
            toast.error('Оберіть предмет');
            return;
        }

        const newPair: Pair = {
            id: 0,
            semester_number: selectedSemester,
            groups_list: selectedGroup ? [selectedGroup] : null,
            teachers_list: selectedTeacher ? [{ id: selectedTeacher, name: teachers.find(t => t.id === selectedTeacher)?.full_name || '' }] : null,
            subject_id: selectedSubject,
            week_number: (pairParams?.weekIndex === 0 ? 1 : 2),
            day_number: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][pairParams?.dayIndex || 0] as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
            pair_number: (pairParams?.pairIndex || 0) + 1,
            lesson_type: lessonType,
            visit_format: visitFormat,
            audience: visitFormat === 'Offline' ? audience : null
        };

        const isDuplicate = pairs.some(pair =>
            pair.subject_id === newPair.subject_id &&
            pair.week_number === newPair.week_number &&
            pair.day_number === newPair.day_number &&
            pair.pair_number === newPair.pair_number
        );

        if (isDuplicate) {
            toast.error('Пара з таким предметом вже існує на цей час');
            return;
        }

        if (selectedTeacher && pairs.length > 0) {
            toast.error('У вчителя може бути тільки одна пара в один час');
            return;
        }

        addPair(newPair)
        setPairs([...pairs, newPair]);
        toast.success('Пара додана успішно');
    };

    const handleEditPair = async (pair: Pair) => {
        try {
            if (pairParams) {
                const criteria = {
                    semester: selectedSemester,
                    subjectId: pair.subject_id,
                    groupId: selectedGroup,
                    teacherId: selectedTeacher,
                    weekNumber: pairParams.weekIndex + 1,
                    dayNumber: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][pairParams.dayIndex],
                    pairNumber: pairParams.pairIndex + 1,
                };
                await editPair(pair, criteria);
            }
            toast.success('Пара оновлена успішно');
        } catch (err) {
            toast.error('Помилка оновлення пари');
        }
    };

    const handleDeletePair = async (pairId: number) => {
        try {
            await deletePair(pairId);
            setPairs(pairs.filter(pair => pair.id !== pairId));
            toast.success('Пара видалена успішно');
        } catch (err) {
            toast.error('Помилка видалення пари');
        }
    };

    const handleUpdateGroups = async (toNextYear: boolean) => {
        try {
            await updateGroups(toNextYear);
            await fetchGroups().then(setGroups).catch(() => toast.error('Помилка отримання груп'));
            await fetchNullGroups().then(setNullGroupsString).catch(() => toast.error('Помилка отримання груп з нульовою кількістю студентів'));
            toast.success('Групи оновлені успішно');
        } catch (err) {
            toast.error('Помилка оновлення груп');
        }
    };

    return (
        <>
            {isAuthenticated ? (
                <div className="admin-panel">
                    {activeSection && (
                        <div className="section-window" ref={sectionWindowRef} style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left', top: `${5 / scale}%` }}>
                            <button className="close-button" onClick={handleCloseSection}>
                                <IoClose />
                            </button>
                            <div className="section-content">
                                <div id="additionally" className={`section ${activeSection === 'additionally' ? 'active' : ''}`}>
                                    <h2>Додатково</h2>
                                    <div className="semester-selector">
                                        <div>
                                            <label>Семестр: </label>
                                            <select value={selectedSemester} onChange={(e) => handleSemesterChange(parseInt(e.target.value))}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className='setIsCollapsed' onClick={() => setIsInstructionCollapsed(!isInstructionCollapsed)}>
                                        <h3 >
                                            Інструкція користуванння {isInstructionCollapsed ? <IoChevronDown /> : <IoChevronUp />}
                                        </h3>
                                    </button>
                                    <div className={`instruction ${isInstructionCollapsed ? 'collapsed' : ''}`}>
                                        <p>1) Додайте групи та їх параметри</p>
                                        <p>2) Додайте вчителів та їх параметри</p>
                                        <p>3) Додайте предмети та груп й вчителів до них, пропишіть кількість запланованих пар</p>
                                        <p>4) Оберіть групу чи вчителя в відповідних пунктах меню щоб редагувати їх розклад</p>
                                        <p>5) Перетягніть розклад однієї пари на іншу щоб поміняти їх місьцями, якщо це не вдається значить ви намагаєтесь задати вчителю 2 пари на один час або групі 2 пари з одного предмету на один час</p>
                                        <p>6) Подвійний клік на пару щоб редагувати її</p>
                                        <p>7) В меню редагування пари оберіть предмет та додайте його</p>
                                        <p>8) Відредагуйте необхідні параметри пари та натисніть „редагувати“</p>
                                        <p>9) Кнопки нижче автоматично перейменують групи минулого/наступного року на групи наступного/минулого року та зададуть їм нову кількість студентів відповідну до назви групи.</p>
                                        <p>10) Внесіть кількість студентів вказаним нижче групам після переходу на наступний/минулий рік</p>
                                    </div>
                                    <h3 style={{ color: 'red' }}>
                                        {nullGroupsString ? `Внесіть кількість студентів для: ${nullGroupsString}` : ''}
                                    </h3>
                                    <h3 style={{ color: 'red' }}>
                                        {mismatchedCurriculumsString ? `Розклад не відповідає навчальному плану для предметів: ${mismatchedCurriculumsString}` : ''}
                                    </h3>
                                    <button onClick={() => handleUpdateGroups(true)}>
                                        Перенести розклад на наступний рік
                                    </button>
                                    <button className='delete' onClick={() => handleUpdateGroups(false)}>
                                        Перенести розклад на рік назад
                                    </button>
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
                                    <label>Назва предмету:</label>
                                    <input
                                        type="text"
                                        placeholder="Введіть назву предмету"
                                        value={newCurriculum.subject_name}
                                        onChange={(e) => setNewCurriculum({ ...newCurriculum, subject_name: e.target.value })}
                                    />
                                    <label id='correspondence'>
                                        {selectedCurriculum ? (selectedCurriculum.correspondence ? `Розклад відповідає навчальному плану` : `Розклад не відповідає навчальному плану`) : ''}
                                    </label>
                                    <button onClick={() => setActiveSection('teachersCurriculum')}>Перейти до вчителів</button>
                                    <button onClick={() => setActiveSection('groupsCurriculum')}>Перейти до груп</button>
                                    {isEditingCurriculum ? (
                                        <button onClick={handleUpdateCurriculum}>Редагувати предмет</button>
                                    ) : (
                                        <button id='addCurriculum' onClick={handleAddCurriculum}>Додати предмет</button>
                                    )}
                                    {selectedCurriculum && (
                                        <button className='delete' onClick={() => handleDeleteCurriculum(selectedCurriculum.id)}>Видалити предмет</button>
                                    )}
                                </div>
                                <div id="teachersCurriculum" className={`section ${activeSection === 'teachersCurriculum' ? 'active' : ''}`}>
                                    <h2>Пов'язані вчителі</h2>
                                    {newCurriculum.related_teachers.map((teacher, index) => (
                                        <div key={index}>
                                            <label>Вчитель:</label>
                                            <select
                                                value={teacher.id}
                                                onChange={(e) => {
                                                    const updatedTeachers = [...newCurriculum.related_teachers];
                                                    updatedTeachers[index].id = e.target.value;
                                                    setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                }}
                                            >
                                                <option value="">Оберіть вчителя</option>
                                                {teachers
                                                    .filter(t => t.full_name.toLowerCase().includes(filterTeacherNameCurriculum.toLowerCase()))
                                                    .map(teacher => (
                                                        <option key={teacher.id} value={teacher.id}>{getTeacherDisplayName(teacher)}</option>
                                                    ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Фільтр за іменем вчителя"
                                                value={filterTeacherNameCurriculum}
                                                onChange={(e) => setFilterTeacherNameCurriculum(e.target.value)}
                                            />
                                            <label>Заплановані лекції:</label>
                                            <input
                                                type="number"
                                                placeholder="Введіть заплановані лекції"
                                                min="0"
                                                value={teacher.planned_lectures === 0 ? '' : teacher.planned_lectures}
                                                onChange={(e) => {
                                                    const updatedTeachers = [...newCurriculum.related_teachers];
                                                    updatedTeachers[index].planned_lectures = parseInt(e.target.value);
                                                    setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                }}
                                            />
                                            <label>Заплановані практики:</label>
                                            <input
                                                type="number"
                                                placeholder="Введіть заплановані практики"
                                                min="0"
                                                value={teacher.planned_practicals === 0 ? '' : teacher.planned_practicals}
                                                onChange={(e) => {
                                                    const updatedTeachers = [...newCurriculum.related_teachers];
                                                    updatedTeachers[index].planned_practicals = parseInt(e.target.value);
                                                    setNewCurriculum({ ...newCurriculum, related_teachers: updatedTeachers });
                                                }}
                                            />
                                            <label>Заплановані лабораторні:</label>
                                            <input
                                                type="number"
                                                placeholder="Введіть заплановані лабораторні"
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
                                    <button onClick={() => setActiveSection('objects')}><span className='back_icon'><IoChevronBack /></span>Назад</button>
                                </div>
                                <div id="groupsCurriculum" className={`section ${activeSection === 'groupsCurriculum' ? 'active' : ''}`}>
                                    <h2>Пов'язані групи</h2>
                                    {newCurriculum.related_groups.map((group, index) => (
                                        <div key={index}>
                                            <label>Код групи:</label>
                                            <input
                                                type="text"
                                                placeholder="Введіть код групи"
                                                value={group.code}
                                                onChange={(e) => {
                                                    const updatedGroups = [...newCurriculum.related_groups];
                                                    updatedGroups[index].code = e.target.value;
                                                    setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                }}
                                            />
                                            <label>Заплановані лекції:</label>
                                            <input
                                                type="number"
                                                placeholder="Введіть заплановані лекції"
                                                min="0"
                                                value={group.planned_lectures === 0 ? '' : group.planned_lectures}
                                                onChange={(e) => {
                                                    const updatedGroups = [...newCurriculum.related_groups];
                                                    updatedGroups[index].planned_lectures = parseInt(e.target.value);
                                                    setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                }}
                                            />
                                            <label>Заплановані практики:</label>
                                            <input
                                                type="number"
                                                placeholder="Введіть заплановані практики"
                                                min="0"
                                                value={group.planned_practicals === 0 ? '' : group.planned_practicals}
                                                onChange={(e) => {
                                                    const updatedGroups = [...newCurriculum.related_groups];
                                                    updatedGroups[index].planned_practicals = parseInt(e.target.value);
                                                    setNewCurriculum({ ...newCurriculum, related_groups: updatedGroups });
                                                }}
                                            />
                                            <label>Заплановані лабораторні:</label>
                                            <input
                                                type="number"
                                                placeholder="Введіть заплановані лабораторні"
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
                                    <button onClick={() => setActiveSection('objects')}><span className='back_icon'><IoChevronBack /></span>Назад</button>
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
                                    <label>Ім'я групи:</label>
                                    <input
                                        type="text"
                                        placeholder="Введіть ім'я групи"
                                        value={newGroup.group_code}
                                        onChange={(e) => setNewGroup({ ...newGroup, group_code: e.target.value })}
                                    />
                                    <label>Спеціальність:</label>
                                    <select
                                        value={newGroup.specialty_id}
                                        onChange={(e) => setNewGroup({ ...newGroup, specialty_id: parseInt(e.target.value) })}
                                    >
                                        <option value="">Оберіть спеціальність</option>
                                        {specialties.map(specialty => (
                                            <option key={specialty.id} value={specialty.id}>{specialty.specialty_name}</option>
                                        ))}
                                    </select>
                                    <label>Кількість студентів:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Введіть кількість студентів"
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
                                    <label>Ім'я вчителя:</label>
                                    <input
                                        type="text"
                                        placeholder="Введіть ім'я вчителя"
                                        value={newTeacher.full_name}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                                    />
                                    <label>Факультет:</label>
                                    <input
                                        type="text"
                                        placeholder="Введіть факультет"
                                        value={newTeacher.department}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                                    />
                                    <label>Посада:</label>
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
                                    {selectedTeacher ? (
                                        <button className='delete' onClick={() => handleDeleteTeacher(selectedTeacher)}>Видалити вчителя</button>
                                    ) : (<></>)}
                                </div>
                                <div id="pair" className={`section ${activeSection === 'pair' ? 'active' : ''}`}>
                                    <h2>Пара</h2>
                                    <div className="add-pair-section">
                                        <select value={selectedSubject || ''} onChange={(e) => setSelectedSubject(parseInt(e.target.value))}>
                                            <option value="">Оберіть предмет для додавання</option>
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
                                        <button onClick={handleAddPair} disabled={!selectedSubject}>Додати пару</button>
                                    </div>
                                    {pairs.map((pair, index) => {
                                        const curriculum = curriculums.find(c => c.id === pair.subject_id);
                                        const relatedTeachers = curriculum ? curriculum.related_teachers.map(t => teachers.find(teacher => teacher.id === parseInt(t.id))) : [];
                                        const relatedGroups = curriculum ? curriculum.related_groups.map(g => groups.find(group => group.group_code === g.code)) : [];

                                        return (
                                            <div key={index} className="pair-item">
                                                <h3>Пара {curriculum?.subject_name}</h3>
                                                <select value={pair.subject_id} onChange={(e) => {
                                                    const updatedPairs = [...pairs];
                                                    updatedPairs[index].subject_id = parseInt(e.target.value);
                                                    setPairs(updatedPairs);
                                                }}>
                                                    <option value="">Оберіть предмет</option>
                                                    {curriculums.map(curriculum => (
                                                        <option key={curriculum.id} value={curriculum.id}>{curriculum.subject_name}</option>
                                                    ))}
                                                </select>
                                                <select multiple value={pair.teachers_list?.map(t => t.id.toString()) || []} onChange={(e) => {
                                                    const updatedPairs = [...pairs];
                                                    updatedPairs[index].teachers_list = Array.from(e.target.selectedOptions, option => {
                                                        const teacherId = parseInt(option.value);
                                                        const teacher = teachers.find(t => t.id === teacherId);
                                                        return { id: teacherId, name: teacher ? teacher.full_name : '' };
                                                    });
                                                    setPairs(updatedPairs);
                                                }}>
                                                    {relatedTeachers.map(teacher => (
                                                        <option key={teacher?.id} value={teacher?.id}>{teacher?.full_name}</option>
                                                    ))}
                                                </select>
                                                <select multiple value={pair.groups_list || []} onChange={(e) => {
                                                    const updatedPairs = [...pairs];
                                                    updatedPairs[index].groups_list = Array.from(e.target.selectedOptions, option => option.value);
                                                    setPairs(updatedPairs);
                                                }}>
                                                    {relatedGroups.map(group => (
                                                        <option key={group?.group_code} value={group?.group_code}>{group?.group_code}</option>
                                                    ))}
                                                </select>
                                                <select value={pair.lesson_type} onChange={(e) => {
                                                    const updatedPairs = [...pairs];
                                                    updatedPairs[index].lesson_type = e.target.value as 'Lecture' | 'Practice' | 'Laboratory';
                                                    setPairs(updatedPairs);
                                                }}>
                                                    <option value="Lecture">Лекція</option>
                                                    <option value="Practice">Практика</option>
                                                    <option value="Laboratory">Лабораторна</option>
                                                </select>
                                                <select value={pair.visit_format} onChange={(e) => {
                                                    const updatedPairs = [...pairs];
                                                    updatedPairs[index].visit_format = e.target.value as 'Offline' | 'Online';
                                                    setPairs(updatedPairs);
                                                }}>
                                                    <option value="Offline">Офлайн</option>
                                                    <option value="Online">Онлайн</option>
                                                </select>
                                                {pair.visit_format === 'Offline' && (
                                                    <input
                                                        type="number"
                                                        placeholder="Аудиторія"
                                                        value={pair.audience || ''}
                                                        onChange={(e) => {
                                                            const updatedPairs = [...pairs];
                                                            updatedPairs[index].audience = parseInt(e.target.value);
                                                            setPairs(updatedPairs);
                                                        }}
                                                    />
                                                )}
                                                <button onClick={() => handleDeletePair(pair.id)}>Видалити пару</button>
                                                <button onClick={() => handleEditPair(pair)}>Редагувати пару</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
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
                                        <button onClick={() => { setActiveSection('objects'); handleSectionClick('objects'); }}>Предмети</button>
                                        <button onClick={() => { setActiveSection('groups'); handleSectionClick('groups'); }}>Групи</button>
                                        <button onClick={() => { setActiveSection('teachers'); handleSectionClick('teachers'); }}>Вчителі</button>
                                        <button onClick={() => { setActiveSection('additionally'); handleSectionClick('additionally'); }}>Додатково</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <MainAdminContent
                        selectedGroup={selectedGroup}
                        selectedTeacher={selectedTeacher}
                        teachers={teachers}
                        selectedSemester={selectedSemester}
                        isBlurred={isBlurred}
                        onPairClick={handlePairClick}
                        pairsRef={pairsRef}
                    />

                    <ToastContainer style={{ transform: `scaleY(${scale})`, transformOrigin: 'top right', position: 'fixed', right: '10 px' }} />
                </div>
            ) : (
                <Authentication setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )}
        </>
    );
};

export default AdminTable;