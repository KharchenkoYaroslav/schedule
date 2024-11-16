import { useLayoutEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

    useLayoutEffect(() => {
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
            setTimeout(handleResize, 100); // Додаємо невелику затримку
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