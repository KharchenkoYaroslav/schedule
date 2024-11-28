import React, { useRef, useEffect } from 'react';
import './styles.css';
import { IoChevronBack } from 'react-icons/io5';
import { PiStudent } from 'react-icons/pi';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { GrUserAdmin } from "react-icons/gr";
import useWindowResize from './useWindowResize';
import useLocalStorage from './useLocalStorage';

interface Props {
    find: string;
    setFind: React.Dispatch<React.SetStateAction<string>>;
    isStudent: boolean;
    setIsStudent: React.Dispatch<React.SetStateAction<boolean>>;
    groupsList: string[];
    teachersList: string[];
    onValueFound: (value: string) => void;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>; 
}

const InputField = ({ find, setFind, isStudent, setIsStudent, groupsList, teachersList, onValueFound, setIsAdmin }: Props) => {
    const [isInputVisible, setIsInputVisible] = useLocalStorage<boolean>("isInputVisible", false);
    const [suggestions, setSuggestions] = useLocalStorage<string[]>("suggestions", []);
    const [isInputFocused, setIsInputFocused] = useLocalStorage<boolean>("isInputFocused", false);
    const suggestionRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scale = useWindowResize();
    
    useEffect(() => {
        const handleFocus = () => {
            document.body.style.backgroundColor = 'hsl(219, 59%, 30%)';
        };

        const handleBlur = () => {
            document.body.style.backgroundColor = '';
        };

        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.addEventListener('focus', handleFocus);
            inputElement.addEventListener('blur', handleBlur);

            return () => {
                inputElement.removeEventListener('focus', handleFocus);
                inputElement.removeEventListener('blur', handleBlur);
            };
        }
    }, [inputRef, isInputVisible]);

    const toTrueInput = (isStudent: boolean) => {
        setIsStudent(isStudent);
        setIsInputVisible(true);
        setSuggestions(isStudent ? groupsList : teachersList);
    };

    const toFalseInput = () => {
        setIsInputVisible(false);
        setSuggestions([]);
        setFind("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFind(value);
        const filteredList = (isStudent ? groupsList : teachersList).filter(item =>
            item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredList);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setFind(suggestion);
        setSuggestions([]);
        setIsInputFocused(false);
        onValueFound(suggestion);
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setIsInputFocused(false);
        }, 200);
    };

    return (
        
        <form className='input' action="" style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>
            {!isInputVisible && (
                
                <div className='buttons-container'>
                <button className='to_feild' onClick={() => toTrueInput(true)} >
                    Я студент<span className='text_icon'><PiStudent /></span>
                </button>
                <button className='to_feild' onClick={() => toTrueInput(false)} >
                    Я вчитель<span className='text_icon'><LiaChalkboardTeacherSolid /></span>
                </button>
                <button className='to_feild' onClick={() => setIsAdmin(true)} >
                    Адміністрація<span className='text_icon'><GrUserAdmin /></span>
                </button>
            </div>
            )}
            {isInputVisible && (
                <>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={isStudent ? 'Введіть назву групи' : 'Введіть своє прізвище'}
                    className='input__box'
                    value={find}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    
                />
                <button className='back_to_start' type="button" onClick={toFalseInput}>
                    <span id='back_icon'><IoChevronBack /></span> назад
                </button>
                {isInputFocused && suggestions.length > 0 && (
                    <div className="suggestions" ref={suggestionRef}>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </>
            )}
        </form>
    );
};

export default InputField;