import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles.css';
import { IoChevronBack } from 'react-icons/io5';
import { PiStudent } from 'react-icons/pi';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';

interface Props {
    find: string;
    setFind: React.Dispatch<React.SetStateAction<string>>;
    isStudent: boolean;
    setIsStudent: React.Dispatch<React.SetStateAction<boolean>>;
    groupsList: string[];
    teachersList: string[];
    onValueFound: (value: string) => void;
}

const InputField = ({ find, setFind, isStudent, setIsStudent, groupsList, teachersList, onValueFound }: Props) => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const suggestionRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        setSuggestions(isStudent ? groupsList : teachersList);
    }, [isStudent, groupsList, teachersList]);

    const toTrueInput = useCallback((event: React.MouseEvent<HTMLButtonElement>, isStudent: boolean) => {
        event.preventDefault();
        setIsStudent(isStudent);
        setIsInputVisible(true);
    }, [setIsStudent, setIsInputVisible]);

    const toFalseInput = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsInputVisible(false);
        setSuggestions([]);
        setFind("");
    }, [setIsInputVisible, setSuggestions, setFind]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFind(value);
        const filteredList = (isStudent ? groupsList : teachersList).filter(item =>
            item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredList);
    }, [setFind, isStudent, groupsList, teachersList, setSuggestions]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
        setFind(suggestion);
        setSuggestions([]);
        setIsInputFocused(false);
        onValueFound(suggestion);
    }, [setFind, setSuggestions, setIsInputFocused, onValueFound]);

    const handleInputFocus = useCallback(() => {
        setIsInputFocused(true);
    }, [setIsInputFocused]);

    const handleInputBlur = useCallback(() => {
        setTimeout(() => {
            setIsInputFocused(false);
        }, 200);
    }, [setIsInputFocused]);

    return (
        <form className='input' action="" onSubmit={(e) => e.preventDefault()}>
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
            {!isInputVisible && (
                <div className='buttons-container'>
                    <button className='to_feild' onClick={(e) => toTrueInput(e, true)}>
                        Я студент<span className='text_icon'><PiStudent /></span>
                    </button>
                    <button className='to_feild' onClick={(e) => toTrueInput(e, false)}>
                        Я вчитель<span className='text_icon'><LiaChalkboardTeacherSolid /></span>
                    </button>
                </div>
            )}
        </form>
    );
};

export default InputField;