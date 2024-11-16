import { useEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth < 1100) {
                const newScale = currentWidth / 1100;
                setScale(newScale);
            } else {
                setScale(1);
            }
        };

        const handleOrientationChange = () => {
            handleResize();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);
        handleResize(); // Викликаємо обробник при монтуванні

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);
    
    return scale;
};

export default useWindowResize;