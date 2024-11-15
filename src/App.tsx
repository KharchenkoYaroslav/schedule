import React, { useState, useEffect } from 'react';
import './App.css';
import InputField from './components/inputField';
import OutputTable from './components/outputTable';
import { FetchGroupList, FetchTeacherList } from './components/getData';
import useWindowResize from './components/useWindowResize';
import useLocalStorage from './components/useLocalStorage';

const App: React.FC = () => {
    const [find, setFind] = useLocalStorage<string>("find", "");
    const [isValueFound, setIsValueFound] = useLocalStorage<boolean>("isValueFound", false);
    const [groupsList, setGroupsList] = useLocalStorage<{ group_code: string }[]>("groupsList", []);
    const [teachersList, setTeachersList] = useLocalStorage<{ full_name: string }[]>("teachersList", []);
    const scale = useWindowResize();

    useEffect(() => {
        const fetchData = async () => {
            const groups = await FetchGroupList();
            const teachers = await FetchTeacherList();
            setGroupsList(groups);
            setTeachersList(teachers);
        };
        fetchData();
    }, []);

    function handleValueFound(value: string) {
        if (groupsList.some(group => group.group_code === value) || teachersList.some(teacher => teacher.full_name === value)) {
            setIsValueFound(true);
        } else {
            setIsValueFound(false);
        }
    }

    return (
        <div className="App" style={{ transform: `scale(${scale})`, transition: '0.2s', transformOrigin: 'top left', width: `${100 / scale}%`, height: '100vh' }}>
            <span className="heading">Розклад занять у ВНЗ</span>
            {!isValueFound && (
                <InputField
                    find={find}
                    setFind={setFind}
                    groupsList={groupsList.map(group => group.group_code)}
                    teachersList={teachersList.map(teacher => teacher.full_name)}
                    onValueFound={handleValueFound}
                />
            )}
            {isValueFound && (
                <OutputTable
                    find={find}
                    setFind={setFind}
                    setIsValueFound={setIsValueFound}
                />
            )}
            
        </div>
    );
}

export default App;