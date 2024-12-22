import React, { useLayoutEffect } from 'react';
import './App.css';
import Navigation from './components/navigation';
import Schedules from './components/schedules';
import AdminPanel from './components/adminPanel'; 
import { FetchCombinedList } from './components/dataManagement';
import useWindowResize from './components/useWindowResize';
import useLocalStorage from './components/useLocalStorage';
import { TeacherData } from './components/structure';

const App: React.FC = () => {
    const [find, setFind] = useLocalStorage<string>("find", "");
    const [isValueFound, setIsValueFound] = useLocalStorage<boolean>("isValueFound", false);
    const [isStudent, setIsStudent] = useLocalStorage<boolean>("isStudent", false);
    const [isAdmin, setIsAdmin] = useLocalStorage<boolean>("isAdmin", false); 
    const [groupsList, setGroupsList] = useLocalStorage<{ group_code: string }[]>("groupsList", []);
    const [teachersList, setTeachersList] = useLocalStorage<TeacherData[]>("teachersList", []);

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
        const found = groupsList.some(group => group.group_code === value) || teachersList.some(teacher => `${teacher.id} - ${teacher.full_name}` === value);
        setIsValueFound(found);
    }

    return (
        <div className="App" style={{ transform: `scaleX(${scale})`, transition: '0.2s', transformOrigin: 'top left', width: `${100 / scale}%`}}>            
            {!isAdmin && (
                <span className="heading" style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>Розклад занять у ВНЗ</span>
            )}
            {!isValueFound && !isAdmin &&(
                    <Navigation
                    find={find}
                    setFind={setFind}
                    isStudent={isStudent}
                    setIsStudent={setIsStudent}
                    groupsList={groupsList.map(group => group.group_code)}
                    teachersList={teachersList.map(teacher => `${teacher.id} - ${teacher.full_name}`)}
                    onValueFound={handleValueFound}
                    setIsAdmin={setIsAdmin} 
                />        
            )}
            {isValueFound && (
                <Schedules
                    find={find}
                    isStudent={isStudent}
                    setIsStudent={setIsStudent}
                    setFind={setFind}
                    setIsValueFound={setIsValueFound}
                    teachersList={teachersList}
                />
            )}
            {isAdmin && (
                <AdminPanel setIsAdmin={setIsAdmin} />
            )}
        </div>
    );
}

export default App;
