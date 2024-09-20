import React, { useState, useRef } from 'react';
import './styles.css';
import { IoChevronBack } from 'react-icons/io5';
import { PiStudent } from 'react-icons/pi';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';

interface Props {
    find: string;
    setFind: React.Dispatch<React.SetStateAction<string>>;
    groupsList: string[];
    teachersList: string[];
    onValueFound: (value: string) => void;
}

const InputField = ({ find, setFind, groupsList, teachersList, onValueFound }: Props) => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isStudent, setStudent] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const suggestionRef = useRef<HTMLDivElement | null>(null);

    const toTrueInput = (event: React.MouseEvent<HTMLButtonElement>, isStudent: boolean) => {
        event.preventDefault();
        setStudent(isStudent);
        setIsInputVisible(true);
    };

    const toFalseInput = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsInputVisible(false);
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
        <form className='input' action="" onSubmit={(e) => e.preventDefault()}>
            {isInputVisible && (
                <>
                    <input
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