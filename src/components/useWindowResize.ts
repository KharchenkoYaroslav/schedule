import { useEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

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

        const mediaQuery = window.matchMedia('(max-width: 899px)');

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                handleResize();
            } else {
                setScale(1);
            }
        };

        mediaQuery.addEventListener('change', handleMediaQueryChange);
        handleResize(); // Виклик при монтуванні компонента

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);
    
    return scale;
};

export default useWindowResize;