import React, { useState, useLayoutEffect } from 'react';
import './App.css';
import InputField from './components/inputField';
import OutputTable from './components/outputTable';
import AdminPanel from './components/AdminPanel'; 
import { FetchCombinedList } from './components/getData';
import useWindowResize from './components/useWindowResize';
import useLocalStorage from './components/useLocalStorage';

const App: React.FC = () => {
    const [find, setFind] = useLocalStorage<string>("find", "");
    const [isValueFound, setIsValueFound] = useLocalStorage<boolean>("isValueFound", false);
    const [isStudent, setIsStudent] = useLocalStorage<boolean>("isStudent", false);
    const [isAdmin, setIsAdmin] = useLocalStorage<boolean>("isAdmin", false); 
    const [groupsList, setGroupsList] = useLocalStorage<{ group_code: string }[]>("groupsList", []);
    const [teachersList, setTeachersList] = useLocalStorage<{ full_name: string }[]>("teachersList", []);
    const scale = useWindowResize();

    useLayoutEffect(() => {
        const fetchData = async () => {
            const data = await FetchCombinedList();
            setGroupsList(data.groups);
            setTeachersList(data.teachers);
        };
        fetchData();

    }, []);

    function handleValueFound(value: string) {
        const found = groupsList.some(group => group.group_code === value) || teachersList.some(teacher => teacher.full_name === value);
        setIsValueFound(found);
    }

    return (
        <div className="App" style={{ transform: `scaleX(${scale})`, transition: '0.2s', transformOrigin: 'top left', width: `${100 / scale}%`}}>            
            {!isAdmin && (
                <span className="heading" style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>Розклад занять у ВНЗ</span>
            )}
            {!isValueFound && !isAdmin &&(
                    <InputField
                    find={find}
                    setFind={setFind}
                    isStudent={isStudent}
                    setIsStudent={setIsStudent}
                    groupsList={groupsList.map(group => group.group_code)}
                    teachersList={teachersList.map(teacher => teacher.full_name)}
                    onValueFound={handleValueFound}
                    setIsAdmin={setIsAdmin} 
                />        
            )}
            {isValueFound && (
                <OutputTable
                    find={find}
                    isStudent={isStudent}
                    setIsStudent={setIsStudent}
                    setFind={setFind}
                    setIsValueFound={setIsValueFound}
                />
            )}
            {isAdmin && (
                <AdminPanel setIsAdmin={setIsAdmin} />
            )}
        </div>
    );
}

export default App;