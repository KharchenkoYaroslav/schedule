import React from 'react';
import { useDrop } from 'react-dnd';

interface DroppableCellProps {
    type: string;
    pairIndex: number;
    dayIndex: number;
    weekIndex: number;
    onDrop: (source: { pairIndex: number; dayIndex: number; weekIndex: number }, destination: { pairIndex: number; dayIndex: number; weekIndex: number }) => void;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ type, pairIndex, dayIndex, weekIndex, onDrop }) => {
    const [{ isOver }, drop] = useDrop({
        accept: type,
        drop: (item: { pairIndex: number; dayIndex: number; weekIndex: number }) => {
            onDrop(item, { pairIndex, dayIndex, weekIndex });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div 
            className='droppable-cell'
            ref={drop}
            style={{ backgroundColor: isOver ? 'DeepSkyBlue' : 'DodgerBlue' } }
        >
            Перетягнути
        </div>
    );
};

export default DroppableCell;