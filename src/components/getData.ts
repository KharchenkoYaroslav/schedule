import axios from 'axios';
import { AbbrPair, GroupPair, GroupSchedule, PairFormat, PairType, Teacher, TeacherPair, TeacherSchedule, Week, Weekday } from './structure';

async function FetchGroupList() {
    try {
        const response = await axios.get(`https://schedule-server-rho.vercel.app/api/groupsList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching group list:', error);
        throw error;
    }
}

async function FetchTeacherList() {
    try {
        const response = await axios.get(`https://schedule-server-rho.vercel.app/api/teachersList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher list:', error);
        throw error;
    }
}

const cur_semester = () => {
    const now = new Date();
    const month = now.getMonth() + 1;

    if (month >= 9 || month <= 1) {
        return 1;
    } else {
        return 2;
    }
};


async function FetchScheduleForGroup(groupName: string): Promise<GroupSchedule | null> {
    try {
        const response = await axios.get(`https://schedule-server-rho.vercel.app/api/getGroup?groupName=${groupName}&semester=${cur_semester()}`);

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const schedule: GroupSchedule = {
            groupName,
            week_1: Array(6).fill(null).map(() => ({
                pairs: Array(6).fill(null),
                dayOfWeek: Weekday.Monday
            })) as Week,
            week_2: Array(6).fill(null).map(() => ({
                pairs: Array(6).fill(null),
                dayOfWeek: Weekday.Monday
            })) as Week
        };

        response.data.forEach((item: any) => {
            const weekNumber = item.week_number === '1' ? 'week_1' : 'week_2';
            const dayOfWeek = Weekday[item.day_number as keyof typeof Weekday];
            const pairNumber = parseInt(item.pair_number, 10) - 1;

            const teachersWithPost = JSON.parse(item.teachers_with_post);
            const teachers: Teacher = [
                teachersWithPost.map((teacher: string) => Object.keys(teacher)[0]),
                teachersWithPost.map((teacher: AbbrPair) => AbbrPair[Object.values(teacher)[0] as keyof typeof AbbrPair])
            ];

            const groupPair = new GroupPair(
                item.subject_name,
                teachers,
                PairType[item.lesson_type as keyof typeof PairType],
                PairFormat[item.visit_format as keyof typeof PairFormat],
                item.building,
                item.audience_number
            );

            const dayIndex = Object.values(Weekday).indexOf(dayOfWeek);
            if (schedule[weekNumber] && schedule[weekNumber]![dayIndex]) {
                schedule[weekNumber]![dayIndex]!.pairs[pairNumber] = groupPair;
                schedule[weekNumber]![dayIndex]!.dayOfWeek = dayOfWeek;
            }
        });

        return schedule;
    } catch (error) {
        console.error('Error fetching group schedule:', error);
        throw error;
    }
}

async function FetchScheduleForTeacher(teacherName: string): Promise<TeacherSchedule | null> {
    try {
        
        const response = await axios.get(`https://schedule-server-rho.vercel.app/api/getTeacher?teacherName=${teacherName}&semester=${cur_semester()}`);

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const schedule: TeacherSchedule = {
            name: teacherName,
            week_1: Array(6).fill(null).map(() => ({
                pairs: Array(6).fill(null),
                dayOfWeek: Weekday.Monday
            })) as Week,
            week_2: Array(6).fill(null).map(() => ({
                pairs: Array(6).fill(null),
                dayOfWeek: Weekday.Monday
            })) as Week
        };

        response.data.forEach((item: any) => {
            const weekNumber = item.week_number === '1' ? 'week_1' : 'week_2';
            const dayOfWeek = Weekday[item.day_number as keyof typeof Weekday];
            const pairNumber = parseInt(item.pair_number, 10) - 1;

            const groupsList = JSON.parse(item.groups_list);

            const teacherPair = new TeacherPair(
                item.subject_name,
                groupsList,
                PairType[item.lesson_type as keyof typeof PairType],
                PairFormat[item.visit_format as keyof typeof PairFormat],
                item.building,
                item.audience_number
            );

            const dayIndex = Object.values(Weekday).indexOf(dayOfWeek);
            if (schedule[weekNumber] && schedule[weekNumber]![dayIndex]) {
                schedule[weekNumber]![dayIndex]!.pairs[pairNumber] = teacherPair;
                schedule[weekNumber]![dayIndex]!.dayOfWeek = dayOfWeek;
            }
        });

        return schedule;
    } catch (error) {
        console.error('Error fetching teacher schedule:', error);
        throw error;
    }
}

export { FetchGroupList, FetchTeacherList, FetchScheduleForGroup, FetchScheduleForTeacher };