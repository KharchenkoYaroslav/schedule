import React, { useState, useEffect } from 'react';
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
} from './structure';
import { FetchScheduleForGroup, FetchScheduleForTeacher } from './getData';

interface Props {
    find: string;
    setFind: React.Dispatch<React.SetStateAction<string>>;
    setIsValueFound: React.Dispatch<React.SetStateAction<boolean>>;
}

const OutputTable: React.FC<Props> = ({ find, setFind, setIsValueFound }) => {

    const [schedule, setSchedule] = useState<GroupSchedule | TeacherSchedule | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupSchedule = await FetchScheduleForGroup(find);
                if (groupSchedule) {
                    setSchedule(groupSchedule);
                    return;
                }

                const teacherSchedule = await FetchScheduleForTeacher(find);
                if (teacherSchedule) {
                    setSchedule(teacherSchedule);
                    return;
                }

                setError("Розклад не знайдено");
            } catch (err) {
                setError("Помилка при отриманні розкладу");
            }
        };

        fetchData();

    }, [find]);



    const formatTypeAndFormat = (types: string | string[], formats: string | string[]): string => {
        if (!Array.isArray(types)) types = [types];
        if (!Array.isArray(formats)) formats = [formats];

        if (types.length === 1 && formats.length > 1) {
            return `${types[0]}., ${formats.join(', ')}.`;
        } else if (types.length === formats.length) {
            return types.map((type, index) => `${type}, ${formats[index]}`).join('., ') + '.';
        } else if (types.length > 1 && formats.length === 1) {
            return `${types.join(', ')}., ${formats[0]}.`;
        } else {
            return '';
        }
    };

    const formatSubject = (subject: string | string[]): string => {
        if (!Array.isArray(subject)) return subject;
        else {
            return `${subject.join(', ')}`;
        }
    };

    const handleTeacherClick = async (teacherName: string) => {
        const teacher = await FetchScheduleForTeacher(teacherName);
        if (teacher) {
            setFind(teacherName);
            setIsValueFound(true);
        } else {
            alert("Розклад не знайдено");
        }
    };

    const handleGroupClick = async (groupName: string) => {
        const group = await FetchScheduleForGroup(groupName);
        if (group) {
            setFind(groupName);
            setIsValueFound(true);
        } else {
            alert("Розклад не знайдено");
        }
    };

    const renderTeachers = (teachers: string | string[], positions: AbbrPair | AbbrPair[]) => {
        if (Array.isArray(teachers) && Array.isArray(positions)) {
            const links = teachers.map((teacher, index) => (
                <a key={index} href="#" onClick={() => handleTeacherClick(teacher)}>
                    {positions[index]}. {teacher}
                </a>
            ));
            return <div className='group_teacher'>{links.map((link, i) => (
                <span className='nowrap' key={i}>
                    {link}
                    {i < links.length - 1 ? ', ' : ''}
                </span>
            ))}</div>;
        } else if (Array.isArray(teachers)) {
            const links = teachers.map((teacher, index) => (
                <a key={index} href="#" onClick={() => handleTeacherClick(teacher)}>
                    {positions}. {teacher}
                </a>
            ));
            return <div className='group_teacher'>{links.map((link, i) => (
                <span className='nowrap' key={i}>
                    {link}
                    {i < links.length - 1 ? ', ' : ''}
                </span>
            ))}</div>;
        } else if (Array.isArray(positions)) {
            const links = positions.map((position, index) => (
                <a key={index} href="#" onClick={() => handleTeacherClick(teachers)}>
                    {position}. {teachers}
                </a>
            ));
            return <div className='group_teacher'>{links.map((link, i) => (
                <span className='nowrap' key={i}>
                    {link}
                    {i < links.length - 1 ? ', ' : ''}
                </span>
            ))}</div>;
        } else {
            return (
                <div  className='group_teacher'>
                    <span className='nowrap'>
                        <a href="#" onClick={() => handleTeacherClick(teachers)}>
                            {positions}. {teachers}
                        </a>
                    </span>
                </div>
            );
        }
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
                        {[...Array(6)].map((_, pairIndex) => (
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
                                                        renderTeachers(pair.getTeacher()[0], pair.getTeacher()[1])
                                                    ) : (
                                                        renderGroups(pair.getGroup())
                                                    )}
                                                    <div className='type_format'>
                                                        {formatTypeAndFormat(pair.getType(), pair.getFormat())}
                                                    </div>
                                                    {pair.getBuilding() !== null && pair.getAudience() !== null && (
                                                        <div className='place'>
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
            }, 5000); 
        }
    }, [error]);

    if (error) {
        return <h3 className='message'>{error}</h3>;
    }

    if (!schedule) {
        return <h3 className='message'>Завантаження...</h3>;
    }

    return (
        <div className="output">
            <h2>{find}</h2>
            <button className='restart' type="button" onClick={() => {
                setIsValueFound(false);
                setFind("");
            }}>
                Вибрати інший розклад<span className='text_icon'><MdOutlineSettingsBackupRestore /></span>
            </button>
            <div className="tables">
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
        </div>
    );
};


export default OutputTable;