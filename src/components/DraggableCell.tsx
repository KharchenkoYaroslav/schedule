import React from 'react';
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
}

const DraggableCell: React.FC<DraggableCellProps> = ({ cell, type, pairIndex, dayIndex, weekIndex, onDrop }) => {
    const [{ isDragging }, drag] = useDrag({
        type,
        item: { pairIndex, dayIndex, weekIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            className='draggable-cell'
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={() => onDrop({ pairIndex, dayIndex, weekIndex }, { pairIndex, dayIndex, weekIndex })}
        >
            {cell && formatSubject(cell.getName())}
        </div>
    );
};

export default DraggableCell;