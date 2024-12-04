import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableCell from './DraggableCell';
import DroppableCell from './DroppableCell';
import { GroupSchedule, Weekday, GroupPair, PairArray } from './structure';
import axios from 'axios';

interface GroupScheduleTableProps {
    schedule: GroupSchedule | null;
    setSchedule: React.Dispatch<React.SetStateAction<GroupSchedule | null>>;
    selectedSemester: number;
    groupName: string;
}

const GroupScheduleTable: React.FC<GroupScheduleTableProps> = ({ schedule, setSchedule, selectedSemester, groupName }) => {
    useEffect(() => {
        if (!schedule) {
            initializeSchedule();
        }
    }, [schedule]);

    const initializeSchedule = () => {
        const newSchedule: GroupSchedule = {
            groupName: groupName,
            week_1: initializeWeek(),
            week_2: initializeWeek(),
        };
        setSchedule(newSchedule);
    };

    const initializeWeek = (): GroupSchedule['week_1'] => {
        return Object.values(Weekday).map(day => ({
            dayOfWeek: day,
            pairs: Array(6).fill(null) as PairArray,
        }));
    };

    const sendScheduleUpdate = async (data: {
        isGroup: boolean;
        semester: number;
        sourceId: number | null;
        sourceWeek: number;
        sourceDay: string;
        sourcePair: number;
        destinationId: number | null;
        destinationWeek: number;
        destinationDay: string;
        destinationPair: number;
    }): Promise<void> => {
        console.log('Sending data to server:', data);
        try {
            await axios.post('https://schedule-server-rho.vercel.app/api/updateSchedule', data);
        } catch (err) {
            console.error('Помилка оновлення розкладу:', err);
            throw err;
        }
    };

    const handleDrop = async (source: { pairIndex: number; dayIndex: number; weekIndex: number }, destination: { pairIndex: number; dayIndex: number; weekIndex: number }) => {
        if (!schedule) return;
    
        const newSchedule = { ...schedule };
        const sourceWeek = source.weekIndex === 0 ? newSchedule.week_1 : newSchedule.week_2;
        const destinationWeek = destination.weekIndex === 0 ? newSchedule.week_1 : newSchedule.week_2;
    
        if (!sourceWeek || !destinationWeek) return;
    
        const sourcePair = sourceWeek[source.dayIndex].pairs[source.pairIndex] as GroupPair;
        const destinationPair = destinationWeek[destination.dayIndex].pairs[destination.pairIndex] as GroupPair;
    
        const getTeacherId = (pair: GroupPair | null): number | null => {
            if (pair && pair instanceof GroupPair) {
                const teacher = pair.getTeacher();
                return Array.isArray(teacher[0]) ? teacher[0][0] : teacher[0];
            }
            return null;
        };
    
        const sourceTeacherId = getTeacherId(sourcePair);
        const destinationTeacherId = getTeacherId(destinationPair);
    
        const sourceDayOfWeek = sourceWeek[source.dayIndex].dayOfWeek;
        const destinationDayOfWeek = destinationWeek[destination.dayIndex].dayOfWeek;
    
        const sourceEnglishDay = convertToEnglishDay(sourceDayOfWeek);
        const destinationEnglishDay = convertToEnglishDay(destinationDayOfWeek);
    
        const data = {
            isGroup: false,
            semester: selectedSemester,
            sourceId: sourceTeacherId,
            sourceWeek: source.weekIndex + 1,
            sourceDay: sourceEnglishDay,
            sourcePair: source.pairIndex + 1,
            destinationId: destinationTeacherId,
            destinationWeek: destination.weekIndex + 1,
            destinationDay: destinationEnglishDay,
            destinationPair: destination.pairIndex + 1,
        };
    
        console.log(data);
    
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

    const renderTable = (week: GroupSchedule['week_1'] | GroupSchedule['week_2'], weekIndex: number) => {
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
                    {[...Array(6)].map((_, pairIndex) => (
                        <tr key={pairIndex}>
                            <td>{pairIndex + 1}</td>
                            {week.map((day, dayIndex) => (
                                <td key={dayIndex}>
                                    <DraggableCell
                                        cell={day.pairs[pairIndex]}
                                        type="groupPair"
                                        pairIndex={pairIndex}
                                        dayIndex={dayIndex}
                                        weekIndex={weekIndex}
                                        onDrop={handleDrop}
                                    />
                                    <DroppableCell
                                        type="groupPair"
                                        pairIndex={pairIndex}
                                        dayIndex={dayIndex}
                                        weekIndex={weekIndex}
                                        onDrop={handleDrop}
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
        <DndProvider backend={HTML5Backend}>
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

export default GroupScheduleTable;