import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { GroupPair, TeacherPair } from './structure';
import { formatSubject } from './formatUtils';

interface DraggableCellProps {
    cell: GroupPair | TeacherPair | null;
    type: string;
    pairIndex: number;
    dayIndex: number;
    weekIndex: number;
    onDrop: (source: { pairIndex: number; dayIndex: number; weekIndex: number }, destination: { pairIndex: number; dayIndex: number; weekIndex: number }) => void;
    onDoubleClick: (pairIndex: number, dayIndex: number, weekIndex: number) => void;
}

const DraggableCell: React.FC<DraggableCellProps> = ({ cell, type, pairIndex, dayIndex, weekIndex, onDrop, onDoubleClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type,
        item: { pairIndex, dayIndex, weekIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        if (clickCount === 1) {
            const timer = setTimeout(() => {
                if (clickCount === 1) {
                    onDrop({ pairIndex, dayIndex, weekIndex }, { pairIndex, dayIndex, weekIndex });
                }
                setClickCount(0);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [clickCount, onDrop, pairIndex, dayIndex, weekIndex]);

    const handleClick = () => {
        setClickCount(prev => prev + 1);
    };

    const handleDoubleClick = () => {
        setClickCount(0);
        onDoubleClick(pairIndex, dayIndex, weekIndex);
    };

    return (
        <div
            className='draggable-cell'
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            title='Подвійний клік для редагування'
        >
            {cell ? formatSubject(cell.getName()): 'Вільно'}
        </div>
    );
};

export default DraggableCell;