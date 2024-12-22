import React, { useState, useEffect } from 'react';
import { Pair, Teacher } from './adminStructure';
import { FetchScheduleForGroup, FetchScheduleForTeacher } from './dataManagement';
import GroupScheduleTable from './groupScheduleTable';
import TeacherScheduleTable from './teacherScheduleTable';
import { GroupSchedule, TeacherSchedule } from './structure';
import useWindowResize from './useWindowResize';

interface MainContentProps {
    selectedGroup: string | null;
    selectedTeacher: number | null;
    teachers: Teacher[];
    selectedSemester: number;
    isBlurred: boolean;
    onPairClick: (pairIndex: number, dayIndex: number, weekIndex: number) => void;
    pairsRef: React.MutableRefObject<Pair[]>;
}

const MainAdminContent: React.FC<MainContentProps> = ({
    selectedGroup,
    selectedTeacher,
    teachers,
    selectedSemester,
    isBlurred,
    onPairClick,
    pairsRef,
}) => {
    const [groupSchedule, setGroupSchedule] = useState<GroupSchedule | null>(null);
    const [teacherSchedule, setTeacherSchedule] = useState<TeacherSchedule | null>(null);
    const [isGroupSchedule, setIsGroupSchedule] = useState<boolean>(false);
    const scale = useWindowResize();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedGroup) {
                const groupSchedule = await FetchScheduleForGroup(selectedGroup, selectedSemester);
                setGroupSchedule(groupSchedule);
                setIsGroupSchedule(true);

            } else if (selectedTeacher) {
                const teacherSchedule = await FetchScheduleForTeacher(selectedTeacher, teachers.find(t => t.id === selectedTeacher)?.full_name || '', selectedSemester);
                setTeacherSchedule(teacherSchedule);
                setIsGroupSchedule(false);
            }
        };

        fetchData();
    }, [selectedGroup, selectedTeacher, selectedSemester, teachers, pairsRef.current]);

    return (
        <div className={`main-content ${isBlurred ? 'blurred' : ''}`} >
            <h1 className='schedule_Lable' style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left' }}>
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
            <div style={{ transform: `scaleY(${scale})`, transformOrigin: 'top left', height: '0px' }}>
                {selectedGroup || selectedTeacher ? (
                    isGroupSchedule ? (
                        <GroupScheduleTable
                            schedule={groupSchedule}
                            setSchedule={setGroupSchedule}
                            selectedSemester={selectedSemester}
                            groupName={selectedGroup || ''}
                            onPairClick={onPairClick}
                        />
                    ) : (
                        <TeacherScheduleTable
                            schedule={teacherSchedule}
                            setSchedule={setTeacherSchedule}
                            selectedSemester={selectedSemester}
                            teacherName={teachers.find(t => t.id === selectedTeacher)?.full_name || ''}
                            teacherId={selectedTeacher || 0}
                            onPairClick={onPairClick}
                        />
                    )
                ) : null}
                <div style={{ minHeight: '20px' }}>
                </div>
            </div>

        </div>
    );
};

export default MainAdminContent;