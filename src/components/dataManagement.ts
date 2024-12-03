import axios from 'axios';
import { AbbrPair, GroupPair, GroupSchedule, PairFormat, PairType, Teacher, TeacherPair, TeacherSchedule, Week, Weekday } from './structure';

async function FetchCombinedList() {
    try {
        const response = await axios.get(`https://schedule-server-rho.vercel.app/api/combinedList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching combined list:', error);
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

        const combinedPairs: { [key: string]: any } = {};

        response.data.forEach((item: any) => {
            const key = `${item.week_number}-${item.day_number}-${item.pair_number}`;
            if (!combinedPairs[key]) {
                combinedPairs[key] = {
                    subject_name: [],
                    teachers_with_post: [],
                    lesson_type: [],
                    visit_format: [],
                    building: item.building,
                    audience_number: item.audience_number
                };
            }

            if (item.subject_name) combinedPairs[key].subject_name.push(item.subject_name);
            if (item.teachers_with_post) combinedPairs[key].teachers_with_post.push(item.teachers_with_post);
            if (item.lesson_type) combinedPairs[key].lesson_type.push(item.lesson_type);
            if (item.visit_format) combinedPairs[key].visit_format.push(item.visit_format);
        });

        Object.keys(combinedPairs).forEach((key) => {
            const [weekNumber, dayNumber, pairNumber] = key.split('-');
            const dayOfWeek = Weekday[dayNumber as keyof typeof Weekday];
            const pairIndex = parseInt(pairNumber, 10) - 1;

            const teachersWithPost = combinedPairs[key].teachers_with_post;

            const teachers: Teacher = [
                teachersWithPost.flat().map((teacher: any) => teacher.name),
                teachersWithPost.flat().map((teacher: any) => AbbrPair[teacher.post as keyof typeof AbbrPair])
            ];

            const groupPair = new GroupPair(
                combinedPairs[key].subject_name,
                teachers,
                combinedPairs[key].lesson_type.map((type: string) => PairType[type as keyof typeof PairType]),
                combinedPairs[key].visit_format.map((format: string) => PairFormat[format as keyof typeof PairFormat]),
                combinedPairs[key].building,
                combinedPairs[key].audience_number
            );

            const dayIndex = Object.values(Weekday).indexOf(dayOfWeek);
            const week = schedule[`week_${weekNumber}`];
            if (week && Array.isArray(week) && week[dayIndex]) {
                week[dayIndex]!.pairs[pairIndex] = groupPair;
                week[dayIndex]!.dayOfWeek = dayOfWeek;
            }
        });

        return schedule;
    } catch (error) {
        console.error('Error fetching group schedule:', error);
        throw error;
    }
}

async function FetchScheduleForTeacher(teacherId: string, teacherName: string): Promise<TeacherSchedule | null> {
    try {
        const response = await axios.get(`https://schedule-server-rho.vercel.app/api/getTeacher?teacherId=${teacherId}&semester=${cur_semester()}`);

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

            const groupsList = item.groups_list;

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

export { FetchCombinedList, FetchScheduleForGroup, FetchScheduleForTeacher };