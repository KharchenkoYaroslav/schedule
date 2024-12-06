import { useEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const handleResizeInternal = () => {
            const currentWidth = window.innerWidth;
            const baseWidth = 1300;

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            let newScale;
            if (isMobile) {
                newScale = 0.4;
            } else {
                if (currentWidth < baseWidth) {
                    newScale = currentWidth / baseWidth;
                } else {
                    newScale = 1;
                }
            }

            setScale(newScale);
        };

        const handleOrientationChange = () => {
            handleResizeInternal();
        };

        window.addEventListener('resize', handleResizeInternal);
        window.addEventListener('orientationchange', handleOrientationChange);
        handleResizeInternal(); 

        return () => {
            window.removeEventListener('resize', handleResizeInternal);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);
    
    return scale;
};

export default useWindowResize;