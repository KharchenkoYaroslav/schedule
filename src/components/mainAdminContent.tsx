import React from 'react';
import { Teacher } from './adminStructure';

interface MainContentProps {
    selectedGroup: string | null;
    selectedTeacher: number | null;
    teachers: Teacher[];
    selectedSemester: number;
    selectedWeek: number;
}

const MainAdminContent: React.FC<MainContentProps> = ({
    selectedGroup,
    selectedTeacher,
    teachers,
    selectedSemester,
    selectedWeek,
}) => {
    return (
        <div className="main-content">
            <h1>
                {selectedGroup || selectedTeacher ? (
                    <>
                        {selectedGroup && `Група: ${selectedGroup}`}
                        {selectedTeacher && `Вчитель: ${teachers.find(t => t.id === selectedTeacher)?.full_name}`}
                        <br />
                        Семестр: {selectedSemester}, Тиждень: {selectedWeek}
                    </>
                ) : (
                    "Оберіть розклад"
                )}
            </h1>
            {/* Основна частина */}
        </div>
    );
};

export default MainAdminContent;