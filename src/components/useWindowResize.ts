import { useEffect, useState, useRef } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        const handleResize = (entries: ResizeObserverEntry[]) => {
            const currentWidth = entries[0].contentRect.width;
            if (currentWidth < 1100) {
                const newScale = currentWidth / 1100;
                setScale(newScale);
            } else {
                setScale(1);
            }
        };

        resizeObserverRef.current = new ResizeObserver(handleResize);

        // Спостерігаємо за елементом, який містить ваші компоненти
        const containerElement = document.getElementById('container');
        if (containerElement) {
            resizeObserverRef.current.observe(containerElement);
        }

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, []);
    
    return scale;
};

export default useWindowResize;