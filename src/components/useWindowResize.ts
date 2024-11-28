import { useEffect, useState } from 'react';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const handleResizeInternal = () => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            const baseWidth = 900;
            const baseHeight = 1600;

            // Перевірка, чи це телефон
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Розрахунок масштабу на основі типу пристрою
            let newScale;
            if (isMobile) {
                // Для мобільних пристроїв встановлюємо фіксований масштаб
                newScale = 0.4;
            } else {
                // Для десктопів розраховуємо масштаб на основі співвідношення ширини до висоти
                const widthScale = currentWidth / baseWidth;
                const heightScale = currentHeight / baseHeight;
                newScale = Math.min(widthScale, heightScale);
            }

            setScale(newScale);
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
    }, []);
    
    return scale;
};

export default useWindowResize;