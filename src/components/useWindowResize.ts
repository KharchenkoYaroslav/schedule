import { useLayoutEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

    useLayoutEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth < 900) {
                const newScale = currentWidth / 900;
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
        setTimeout(() => {
            handleResize(); 
        }, 100); 
        

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);
    
    return scale;
};

export default useWindowResize;