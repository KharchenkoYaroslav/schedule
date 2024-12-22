import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Cell from './cell';
import { TeacherSchedule, Weekday, TeacherPair, PairArray } from './structure';
import axios from 'axios';
import { toast } from 'react-toastify';

interface TeacherScheduleTableProps {
    schedule: TeacherSchedule | null;
    setSchedule: React.Dispatch<React.SetStateAction<TeacherSchedule | null>>;
    selectedSemester: number;
    teacherName: string;
    teacherId: number;
    onPairClick: (pairIndex: number, dayIndex: number, weekIndex: number) => void;
}

const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({ schedule, setSchedule, selectedSemester, teacherName, teacherId, onPairClick }) => {
    useEffect(() => {
        if (!schedule) {
            initializeSchedule();
        }
    }, [schedule]);

    const initializeSchedule = () => {
        const newSchedule: TeacherSchedule = {
            id: teacherId,
            name: teacherName,
            week_1: initializeWeek(),
            week_2: initializeWeek(),
        };
        setSchedule(newSchedule);
    };

    const initializeWeek = (): TeacherSchedule['week_1'] => {
        return Object.values(Weekday).map(day => ({
            dayOfWeek: day,
            pairs: Array(7).fill(null) as PairArray,
        }));
    };

    const sendScheduleUpdate = async (data: {
        semester: number;
        sourceId: string | null;
        sourceWeek: number;
        sourceDay: string;
        sourcePair: number;
        destinationId: string | null;
        destinationWeek: number;
        destinationDay: string;
        destinationPair: number;
    }): Promise<void> => {
        try {
            await axios.post('https://schedule-server-rho.vercel.app/api/updateSchedule', data);
            toast.success('Розклад успішно оновлено!');
        } catch (err) {
            console.error('Помилка оновлення розкладу:', err);
            toast.error('Помилка оновлення розкладу!');
            throw err;
        }
    };

    const handleDrop = async (source: { pairIndex: number; dayIndex: number; weekIndex: number }, destination: { pairIndex: number; dayIndex: number; weekIndex: number }) => {
        if (!schedule) return;

        const newSchedule = { ...schedule };
        const sourceWeek = source.weekIndex === 0 ? newSchedule.week_1 : newSchedule.week_2;
        const destinationWeek = destination.weekIndex === 0 ? newSchedule.week_1 : newSchedule.week_2;

        if (!sourceWeek || !destinationWeek) return;

        const sourcePair = sourceWeek[source.dayIndex].pairs[source.pairIndex] as TeacherPair;
        const destinationPair = destinationWeek[destination.dayIndex].pairs[destination.pairIndex] as TeacherPair;

        const getGroupId = (pair: TeacherPair | null): string | null => {
            if (pair && pair instanceof TeacherPair) {
                const group = pair.getGroup();
                return Array.isArray(group[0]) ? group[0][0] : group[0];
            }
            return null;
        };

        const sourceGroupId = getGroupId(sourcePair);
        const destinationGroupId = getGroupId(destinationPair);

        const sourceDayOfWeek = sourceWeek[source.dayIndex].dayOfWeek;
        const destinationDayOfWeek = destinationWeek[destination.dayIndex].dayOfWeek;

        const sourceEnglishDay = convertToEnglishDay(sourceDayOfWeek);
        const destinationEnglishDay = convertToEnglishDay(destinationDayOfWeek);

        const data = {
            semester: selectedSemester,
            sourceId: sourceGroupId,
            sourceWeek: source.weekIndex + 1,
            sourceDay: sourceEnglishDay,
            sourcePair: source.pairIndex + 1,
            destinationId: destinationGroupId,
            destinationWeek: destination.weekIndex + 1,
            destinationDay: destinationEnglishDay,
            destinationPair: destination.pairIndex + 1,
        };

        try {
            await sendScheduleUpdate(data);
        } catch (error) {
            console.error('Помилка оновлення розкладу:', error);
            return;
        }

        sourceWeek[source.dayIndex].pairs[source.pairIndex] = destinationPair;
        destinationWeek[destination.dayIndex].pairs[destination.pairIndex] = sourcePair;

        setSchedule(newSchedule);
    };

    const convertToEnglishDay = (ukrainianDay: string): string => {
        const daysMap: { [key: string]: string } = {
            "Понеділок": "Monday",
            "Вівторок": "Tuesday",
            "Середа": "Wednesday",
            "Четвер": "Thursday",
            "П'ятниця": "Friday",
            "Субота": "Saturday",
            "Неділя": "Sunday",
        };
        return daysMap[ukrainianDay] || ukrainianDay;
    };

    const renderTable = (week: TeacherSchedule['week_1'] | TeacherSchedule['week_2'], weekIndex: number) => {
        if (!week) return null;

        return (
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Пара</th>
                        {Object.values(Weekday).map(day => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(7)].map((_, pairIndex) => (
                        <tr key={pairIndex}>
                            <td>{pairIndex + 1}</td>
                            {week.map((day, dayIndex) => (
                                <td key={dayIndex}>
                                    <Cell
                                        cell={day.pairs[pairIndex]}
                                        type="teacherPair"
                                        pairIndex={pairIndex}
                                        dayIndex={dayIndex}
                                        weekIndex={weekIndex}
                                        onDrop={handleDrop}
                                        onDoubleClick={onPairClick}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <DndProvider backend={HTML5Backend} >
            {schedule && (
                <>
                    <h3>Тиждень 1</h3>
                    {renderTable(schedule.week_1, 0)}
                    <h3>Тиждень 2</h3>
                    {renderTable(schedule.week_2, 1)}
                </>
            )}
        </DndProvider>
    );
};

export default TeacherScheduleTable;