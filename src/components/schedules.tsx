import React, { useState, useEffect} from 'react';
import './styles.css';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import {
    Weekday,
    PairTime,
    GroupPair,
    Week,
    GroupSchedule,
    TeacherSchedule,
    AbbrPair,
    TeacherData,
} from './structure';
import { FetchScheduleForGroup, FetchScheduleForTeacher } from './dataManagement';
import useWindowResize from './useWindowResize';
import ScheduleManager from './scheduleManager';
import useLocalStorage from './useLocalStorage';
import { formatSubject, formatTypeAndFormat, transform_name } from './formatUtils';

interface Props {
    find: string;
    isStudent: boolean;
    setIsStudent: React.Dispatch<React.SetStateAction<boolean>>;
    setFind: React.Dispatch<React.SetStateAction<string>>;
    setIsValueFound: React.Dispatch<React.SetStateAction<boolean>>;
    teachersList: TeacherData[];
}

const Schedules: React.FC<Props> = ({ find, isStudent, setIsStudent, setFind, setIsValueFound, teachersList }) => {
    const [schedule, setSchedule] = useState<GroupSchedule | TeacherSchedule | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scheduleManager, setScheduleManager] = useLocalStorage<ScheduleManager>('ScheduleManager', new ScheduleManager());

    const scale = useWindowResize();

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const response = await fetch('https://schedule-server-rho.vercel.app/api/lastDatabaseUpdate');
                const data = await response.json();
                const serverLastUpdate = data.lastUpdate;

                let fetchedSchedule: GroupSchedule | TeacherSchedule | null = null;

                if (!(scheduleManager instanceof ScheduleManager)) {
                    const storedData = localStorage.getItem('ScheduleManager');
                    if (storedData) {
                        setScheduleManager(ScheduleManager.deserialize(storedData));
                    } else {
                        setScheduleManager(new ScheduleManager());
                    }
                    return;
                }

                console.log(isStudent);

                if (isStudent) {
                    if (scheduleManager.isGroupScheduleUpToDate(find, serverLastUpdate)) {
                        fetchedSchedule = scheduleManager.getGroupSchedule(find);
                    } else {
                        fetchedSchedule = await FetchScheduleForGroup(find);
                        if (fetchedSchedule) {
                            scheduleManager.addOrUpdateGroupSchedule(find, fetchedSchedule, serverLastUpdate);
                        } else {
                            scheduleManager.removeGroupSchedule(find);
                            timeoutId = setTimeout(() => {
                                if (isMounted) {
                                    setIsValueFound(false);
                                    setFind("");
                                }
                            }, 1500);
                        }
                    }
                } else {
                    const teacher = teachersList.find(teacher => `${teacher.id} - ${teacher.full_name}` === find);
                    if (teacher) {
                        if (scheduleManager.isTeacherScheduleUpToDate(teacher.id, serverLastUpdate)) {
                            fetchedSchedule = scheduleManager.getTeacherSchedule(teacher.id);                            
                        } else {
                            fetchedSchedule = await FetchScheduleForTeacher(teacher.id, teacher.full_name);
                            if (fetchedSchedule) {
                                scheduleManager.addOrUpdateTeacherSchedule(teacher.id, fetchedSchedule, serverLastUpdate);
                            } else {
                                scheduleManager.removeTeacherSchedule(teacher.id);
                                timeoutId = setTimeout(() => {
                                    if (isMounted) {
                                        setIsValueFound(false);
                                        setFind("");
                                    }
                                }, 1500);
                            }
                        }
                    } else {
                        setError("Вчитель не знайдений");
                        timeoutId = setTimeout(() => {
                            if (isMounted) {
                                setIsValueFound(false);
                                setFind("");
                            }
                        }, 1500);
                    }
                }

                if (isMounted) {
                    setSchedule(fetchedSchedule);
                    localStorage.setItem('ScheduleManager', scheduleManager.serialize());
                }

            } catch (err) {
                if (isMounted) {
                    setError("Помилка при отриманні розкладу");
                    console.log(err);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [find, isStudent, scheduleManager, teachersList]);

    const handleTeacherClick = async (teacherName: string, teacherID: number) => {
        setFind(`${teacherID} - ${teacherName}`);
        setIsValueFound(true);
        setIsStudent(false);
    };

    const handleGroupClick = async (groupName: string) => {
        setFind(groupName);
        setIsValueFound(true);
        setIsStudent(true);
    };

    const renderTeachers = (teachers_id: number | number[], teachers_name: string | string[], positions: AbbrPair | AbbrPair[]) => {
        const teachersArray = Array.isArray(teachers_id) ? teachers_id : [teachers_id];
        const namesArray = Array.isArray(teachers_name) ? teachers_name : [teachers_name];
        const positionsArray = Array.isArray(positions) ? positions : [positions];

        const links = teachersArray.map((teacherId, index) => (
            <a key={index} className='nowrap' href="#" onClick={() => handleTeacherClick(namesArray[index], Number(teacherId))}>
                {positionsArray[index]}. {transform_name(namesArray[index])}
            </a>
        ));

        return (
            <div className='group_teacher'>
                {links.map((link, i) => (
                    <span key={i}>
                        {link}
                        {i < links.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>
        );
    };

    const renderGroups = (groups: string | string[]) => {
        if (Array.isArray(groups)) {
            const links = groups.map((group, index) => (
                <a key={index} href="#" onClick={() => handleGroupClick(group)}>
                    {group}
                </a>
            ));
            return <div className='group_teacher'>{links.map((link, i) => (
                <span key={i}>
                    {link}
                    {i < links.length - 1 ? ', ' : ''}
                </span>
            ))}</div>;
        } else {
            return (
                <div className='group_teacher'>
                    <a href="#" onClick={() => handleGroupClick(groups)}>
                        {groups}
                    </a>
                </div>
            );
        }
    };

    const renderTable = (week: Week | null, weekName: string) => {
        if (!week) {
            return <h3>Розклад на тиждень {weekName} не знайдено</h3>;
        }

        return (
            <div className="table-container">
                <h3>{weekName}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Пара</th>
                            {Object.values(Weekday).map(day => <th key={day}>{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(7)].map((_, pairIndex) => (
                            <tr key={pairIndex}>
                                <td>{pairIndex + 1} <br /> {PairTime[pairIndex + 1]}</td>
                                {Object.values(Weekday).map(day => {
                                    const pair = week.find(d => d?.dayOfWeek === day)?.pairs[pairIndex];
                                    return (
                                        <td key={day}>
                                            {pair && (
                                                <>
                                                    <div className='subject'>{formatSubject(pair.getName())}</div>
                                                    {pair instanceof GroupPair ? (
                                                        renderTeachers(pair.getTeacher()[0], pair.getTeacher()[1] , pair.getTeacher()[2])
                                                    ) : (
                                                        renderGroups(pair.getGroup())
                                                    )}
                                                    <div className='type_format'>
                                                        {formatTypeAndFormat(pair.getType(), pair.getFormat())}
                                                    </div>
                                                    {pair.getBuilding() !== null && pair.getAudience() !== null && (
                                                        <div className='place' >
                                                            <span className='nowrap'>
                                                                {`Аудиторія: ${pair.getBuilding()}, корпус: ${pair.getAudience()}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const getCurrentWeek = (): number => {
        const startDate: Date = new Date('2024-10-06');
        const today: Date = new Date();

        const dayOfWeekToday: number = today.getDay();
        const diffToday: number = today.getDate() - dayOfWeekToday + (dayOfWeekToday === 0 ? -6 : 1);
        const startOfCurrentWeek: Date = new Date(today.setDate(diffToday));

        const dayOfWeekStart: number = startDate.getDay();
        const diffStart: number = startDate.getDate() - dayOfWeekStart + (dayOfWeekStart === 0 ? -6 : 1);
        const startOfStartWeek: Date = new Date(startDate.setDate(diffStart));

        const diffInTime: number = startOfCurrentWeek.getTime() - startOfStartWeek.getTime();
        const diffInWeeks: number = Math.floor(diffInTime / (1000 * 60 * 60 * 24 * 7));

        const weekNumber: number = (diffInWeeks % 2) + 1;

        return weekNumber;
    };

    const currentWeek = getCurrentWeek();

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setIsValueFound(false);
                setFind("");
            }, 1500);
        }
    }, [error]);

    if (error) {
        return <h3 className='message' style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>{error}</h3>;
    }

    if (!schedule) {
        return <h3 className='message' style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>Завантаження...</h3>;
    }

    const teacher = teachersList.find(teacher => `${teacher.id} - ${teacher.full_name}` === find);
    const teacherName = teacher ? `${teacher.full_name} (${teacher.department})` : find;

    return (
        <div className="output" style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>
            <h2>{teacherName}</h2>
            <button className='restart' type="button" onClick={() => {
                setIsValueFound(false);
                setFind("");
            }}>
                Вибрати інший розклад<span className='text_icon'><MdOutlineSettingsBackupRestore /></span>
            </button>
            <div className="tables" >
                {currentWeek === 1 ? (
                    <>
                        {renderTable(schedule.week_1, "Цей тиждень")}
                        {renderTable(schedule.week_2, "Наступний тиждень")}
                    </>
                ) : (
                    <>
                        {renderTable(schedule.week_2, "Цей тиждень")}
                        {renderTable(schedule.week_1, "Наступний тиждень")}
                    </>
                )}
            </div>
            <div style={{ minHeight: '200px', display:'block' }}>
                 
            </div>
        </div>
    );
};

export default Schedules;