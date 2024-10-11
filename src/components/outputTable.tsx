import React from 'react';
import './styles.css';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { 
    Weekday, 
    PairTime, 
    GroupPair, 
    Week, 
    GroupSchedule, 
    TeacherSchedule,
    AbbrPair
} from './structure';

interface Props {
    find: string;
    setFind: React.Dispatch<React.SetStateAction<string>>;
    setIsValueFound: React.Dispatch<React.SetStateAction<boolean>>;
    groupsList: GroupSchedule[];
    teachersList: TeacherSchedule[];
}

const OutputTable: React.FC<Props> = ({ find, setFind, setIsValueFound, groupsList, teachersList }) => {
    const schedule = groupsList.find(group => group.groupName === find) || teachersList.find(teacher => teacher.name === find);

    if (!schedule) {
        return <h3>Розклад не знайдено</h3>;
    }

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
            return  `${subject.join(', ')}`;
        }
    };

    const handleTeacherClick = (teacherName: string) => {
        const teacher = teachersList.find(t => t.name === teacherName);
        if (teacher) {
            setFind(teacherName);
            setIsValueFound(true);
        } else {
            alert("Розклад не знайдено");
        }
    };

    const handleGroupClick = (groupName: string) => {
        const group = groupsList.find(g => g.groupName === groupName);
        if (group) {
            setFind(groupName);
            setIsValueFound(true);
        } else {
            alert("Розклад не знайдено");
        }
    };

    const renderTeachers = (teachers: string | string[], positions: AbbrPair | AbbrPair[]) => {
        if (Array.isArray(teachers) && Array.isArray(positions)) {
            return teachers.map((teacher, index) => (
                <div key={index} className='group_teacher'>
                    <a href="#" onClick={() => handleTeacherClick(teacher)}>{positions[index]}. {teacher}</a>
                </div>
            ));
        } else if (Array.isArray(teachers)) {
            return teachers.map((teacher, index) => (
                <div key={index} className='group_teacher'>
                    <a href="#" onClick={() => handleTeacherClick(teacher)}>{positions}. {teacher}</a>
                </div>
            ));
        } else if (Array.isArray(positions)) {
            return positions.map((position, index) => (
                <div key={index} className='group_teacher'>
                    <a href="#" onClick={() => handleTeacherClick(teachers)}>{position}. {teachers}</a>
                </div>
            ));
        } else {
            return (
                <div className='group_teacher'>
                    <a href="#" onClick={() => handleTeacherClick(teachers)}>{positions}. {teachers}</a>
                </div>
            );
        }
    };

    const renderGroups = (groups: string | string[]) => {
        if (Array.isArray(groups)) {
            return groups.map((group, index) => (
                <div key={index} className='group_teacher'>
                    <a href="#" onClick={() => handleGroupClick(group)}>{group}</a>
                </div>
            ));
        } else {
            return (
                <div className='group_teacher'>
                    <a href="#" onClick={() => handleGroupClick(groups)}>{groups}</a>
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
                                <td>{pairIndex + 1} <br/> {PairTime[pairIndex + 1]}</td>
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

    return (
        <div className="output">
            <h2>{find}</h2>
            <button className='restart' type="button" onClick={(e) => window.location.reload()}>
                Заново<span className='text_icon'><MdOutlineSettingsBackupRestore /></span>
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