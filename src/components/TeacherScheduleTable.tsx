import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableCell from './DraggableCell';
import DroppableCell from './DroppableCell';
import { TeacherSchedule, Weekday, TeacherPair, PairArray } from './structure';
import './styles.css'; // Імпортуємо CSS

interface TeacherScheduleTableProps {
    schedule: TeacherSchedule | null;
    setSchedule: React.Dispatch<React.SetStateAction<TeacherSchedule | null>>;
}

const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({ schedule, setSchedule }) => {
    const handleDrop = (source: { pairIndex: number; dayIndex: number; weekIndex: number }, destination: { pairIndex: number; dayIndex: number; weekIndex: number }) => {
        if (!schedule) return;

        const newSchedule = { ...schedule };
        const sourceWeek = source.weekIndex === 0 ? newSchedule.week_1 : newSchedule.week_2;
        const destinationWeek = destination.weekIndex === 0 ? newSchedule.week_1 : newSchedule.week_2;

        if (!sourceWeek || !destinationWeek) return;

        const sourcePair = sourceWeek[source.dayIndex].pairs[source.pairIndex];
        const destinationPair = destinationWeek[destination.dayIndex].pairs[destination.pairIndex];

        // Оновлюємо стан
        sourceWeek[source.dayIndex].pairs[source.pairIndex] = destinationPair;
        destinationWeek[destination.dayIndex].pairs[destination.pairIndex] = sourcePair;

        setSchedule(newSchedule);
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
                    {[...Array(6)].map((_, pairIndex) => (
                        <tr key={pairIndex}>
                            <td>{pairIndex + 1}</td> {/* Номер пари */}
                            {week.map((day, dayIndex) => (
                                <td key={dayIndex}>
                                    <DraggableCell
                                        cell={day.pairs[pairIndex]}
                                        type="teacherPair"
                                        pairIndex={pairIndex}
                                        dayIndex={dayIndex}
                                        weekIndex={weekIndex}
                                        onDrop={handleDrop}
                                    />
                                    <DroppableCell
                                        type="teacherPair"
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

export default TeacherScheduleTable;