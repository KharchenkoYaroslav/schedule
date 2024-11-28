import { useEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(false);

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

        const handleOrientationChange = () => {
            handleResize();
        };

        // Визначаємо, чи є пристрій мобільним
        const checkIsMobile = () => {
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            setIsMobile(mediaQuery.matches);
        };

        checkIsMobile();

        if (isMobile) {
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleOrientationChange);
        } else {
            const mediaQuery = window.matchMedia('(max-width: 899px)');
            const handleMediaQueryChange = (event: MediaQueryListEvent) => {
                if (event.matches) {
                    handleResize();
                } else {
                    setScale(1);
                }
            };
            mediaQuery.addEventListener('change', handleMediaQueryChange);

            // Виклик при монтуванні компонента
            handleResize();

            return () => {
                if (isMobile) {
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('orientationchange', handleOrientationChange);
                } else {
                    mediaQuery.removeEventListener('change', handleMediaQueryChange);
                }
            };
        }
    }, [isMobile]);
    
    return scale;
};

export default useWindowResize;