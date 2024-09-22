import React, { useState, useEffect } from 'react';
import './App.css';
import InputField from './components/inputField1';
import OutputTable from './components/outputTable1';
import { getDataGroups, getDataTeachers } from './components/getData';
import {
    GroupSchedule,
    TeacherSchedule
} from './components/structure1';
import useWindowResize from './components/useWindowResize';

const App: React.FC = () => {
    const [find, setFind] = useState<string>("");
    const [isValueFound, setIsValueFound] = useState<boolean>(false);
    const [groupsList, setGroupsList] = useState<GroupSchedule[]>([]);
    const [teachersList, setTeachersList] = useState<TeacherSchedule[]>([]);
    const scale = useWindowResize();

    useEffect(() => {
        const fetchData = async () => {
            const groups = getDataGroups();
            const teachers = getDataTeachers();
            setGroupsList(groups);
            setTeachersList(teachers);
        };
        fetchData();
    }, []);

    function handleValueFound(value: string) {
        if (groupsList.some(group => group.groupName === value) || teachersList.some(teacher => teacher.name === value)) {
            setIsValueFound(true);
        }
    }

    return (
        <div className="App" style={{ transform: `scale(${scale})`, transition: '0.2s', transformOrigin: 'top left', width: `${100 / scale}%`, height: '100vh' }}>
            <span className="heading">Розклад занять у ВНЗ</span>
            {!isValueFound && (
                <InputField
                    find={find}
                    setFind={setFind}
                    groupsList={groupsList.map(group => group.groupName)}
                    teachersList={teachersList.map(teacher => teacher.name)}
                    onValueFound={handleValueFound}
                />
            )}
            {isValueFound && (
                <OutputTable
                    find={find}
                    setFind={setFind}
                    setIsValueFound={setIsValueFound}
                    groupsList={groupsList}
                    teachersList={teachersList}
                />
            )}
        </div>
    );
}

export default App;