import { useEffect, useState, useRef } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth < 900) {
                const newScale = currentWidth / 900;
                setScale(newScale);
            } else {
                setScale(1);
            }
        };

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(document.documentElement);

        handleResize();

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, []);
    console.log(scale)
    
    return scale;
};

export default useWindowResize;