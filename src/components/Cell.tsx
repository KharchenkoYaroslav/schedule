import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import { GroupPair, TeacherPair } from './structure';
import { formatSubject } from './formatUtils';

interface CellProps {
    cell: GroupPair | TeacherPair | null;
    type: string;
    pairIndex: number;
    dayIndex: number;
    weekIndex: number;
    onDrop: (source: { pairIndex: number; dayIndex: number; weekIndex: number }, destination: { pairIndex: number; dayIndex: number; weekIndex: number }) => void;
    onDoubleClick: (pairIndex: number, dayIndex: number, weekIndex: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, type, pairIndex, dayIndex, weekIndex, onDrop, onDoubleClick }) => {
    const [{ isDragging }, drag, preview] = useDrag({
        type,
        item: { pairIndex, dayIndex, weekIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: type,
        drop: (item: { pairIndex: number; dayIndex: number; weekIndex: number }) => {
            onDrop(item, { pairIndex, dayIndex, weekIndex });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
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
            }, 500);

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

    const backgroundColor = isOver ? 'RoyalBlue' : undefined;

    return (
        <>
        <DragPreviewImage connect={preview} src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" />
        <div
            className={`cell ${!cell ? 'empty' : ''} ${isOver ? 'is-over' : ''} `}
            ref={(node) => drag(drop(node))}
            style={{ 
                opacity: isDragging ? 0.5 : 1, 
                fontWeight: cell ? 'bold' : 'normal',
                backgroundColor,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            title='Перетягнути щоб поміняти місьцями, подвійний клік для редагування'
        >
            {cell ? formatSubject(cell.getName()) : 'Вільно'}
        </div>
        </>
    );
};

export default Cell;