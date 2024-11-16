import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const useWindowResize = () => {
    const [scale, setScale] = useState<number>(1);

    const isMobile = useMediaQuery({ maxWidth: 1100 });

    useEffect(() => {
        if (isMobile) {
            const newScale = window.innerWidth / 1100;
            setScale(newScale);
        } else {
            setScale(1);
        }
    }, [isMobile]);
    
    return scale;
};

export default useWindowResize;