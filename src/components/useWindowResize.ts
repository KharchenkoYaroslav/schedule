import { useEffect, useState } from 'react';

const useWindowResize = (handleResize: () => void) => {
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const handleResizeInternal = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth < 900) {
                const newScale = currentWidth / 900;
                setScale(newScale);
            } else {
                setScale(1);
            }
        };

        const handleOrientationChange = () => {
            handleResizeInternal();
        };

        window.addEventListener('resize', handleResizeInternal);
        window.addEventListener('orientationchange', handleOrientationChange);
        handleResizeInternal(); // Виклик при монтуванні компонента

        return () => {
            window.removeEventListener('resize', handleResizeInternal);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [handleResize]);
    
    return scale;
};

export default useWindowResize;