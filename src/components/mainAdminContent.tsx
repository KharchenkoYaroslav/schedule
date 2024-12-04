import React, { useState, useEffect } from 'react';
import { Teacher } from './adminStructure';
import { FetchScheduleForGroup, FetchScheduleForTeacher } from './dataManagement';
import GroupScheduleTable from './GroupScheduleTable';
import TeacherScheduleTable from './TeacherScheduleTable';
import { GroupSchedule, TeacherSchedule } from './structure';

interface MainContentProps {
    selectedGroup: string | null;
    selectedTeacher: number | null;
    teachers: Teacher[];
    selectedSemester: number;
    isBlurred: boolean;
}

const MainAdminContent: React.FC<MainContentProps> = ({
    selectedGroup,
    selectedTeacher,
    teachers,
    selectedSemester,
    isBlurred
}) => {
    const [groupSchedule, setGroupSchedule] = useState<GroupSchedule | null>(null);
    const [teacherSchedule, setTeacherSchedule] = useState<TeacherSchedule | null>(null);
    const [isGroupSchedule, setIsGroupSchedule] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedGroup) {
                const groupSchedule = await FetchScheduleForGroup(selectedGroup);
                if (groupSchedule) {
                    setGroupSchedule(groupSchedule);
                    setIsGroupSchedule(true);
                }
            } else if (selectedTeacher) {
                const teacherSchedule = await FetchScheduleForTeacher(selectedTeacher.toString(), teachers.find(t => t.id === selectedTeacher)?.full_name || '');
                if (teacherSchedule) {
                    setTeacherSchedule(teacherSchedule);
                    setIsGroupSchedule(false);
                }
            }
        };

        fetchData();
    }, [selectedGroup, selectedTeacher, selectedSemester, teachers]);

    return (
        <div className={`main-content ${isBlurred ? 'blurred' : ''}`}>
            <h1 className='schedule_Lable'>
                {selectedGroup || selectedTeacher ? (
                    <>
                        {selectedGroup && `Група: ${selectedGroup}`}
                        {selectedTeacher && `Вчитель: ${teachers.find(t => t.id === selectedTeacher)?.full_name}`}
                        {selectedTeacher && `, ID: ${selectedTeacher}`}
                        <br />
                        Семестр: {selectedSemester}
                    </>
                ) : (
                    "Оберіть розклад"
                )}
            </h1>
            {selectedGroup || selectedTeacher ? (
                isGroupSchedule ? (
                    <GroupScheduleTable
                        schedule={groupSchedule}
                        setSchedule={setGroupSchedule}
                        selectedSemester={selectedSemester}
                        groupName={selectedGroup || ''}
                    />
                ) : (
                    <TeacherScheduleTable
                        schedule={teacherSchedule}
                        setSchedule={setTeacherSchedule}
                        selectedSemester={selectedSemester}
                        teacherName={teachers.find(t => t.id === selectedTeacher)?.full_name || ''}
                        teacherId={selectedTeacher || 0}
                    />
                )
            ) : null}
        </div>
    );
};

export default MainAdminContent;