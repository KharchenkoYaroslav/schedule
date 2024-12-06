import axios from 'axios';
import { Curriculum, Group, Specialty, Teacher, Pair } from './adminStructure';

export const fetchGroups = async (): Promise<Group[]> => {
    try {
        const response = await axios.get('https://schedule-server-rho.vercel.app/api/groups');
        return response.data;
    } catch (err) {
        console.error('Помилка отримання груп:', err);
        throw err;
    }
};

export const fetchTeachers = async (): Promise<Teacher[]> => {
    try {
        const response = await axios.get('https://schedule-server-rho.vercel.app/api/teachers');
        return response.data;
    } catch (err) {
        console.error('Помилка отримання вчителів:', err);
        throw err;
    }
};

export const fetchSpecialties = async (): Promise<Specialty[]> => {
    try {
        const response = await axios.get('https://schedule-server-rho.vercel.app/api/specialties');
        return response.data;
    } catch (err) {
        console.error('Помилка отримання спеціальностей:', err);
        throw err;
    }
};

export const fetchCurriculums = async (): Promise<Curriculum[]> => {
    try {
        const response = await axios.get('https://schedule-server-rho.vercel.app/api/curriculums');
        return response.data;
    } catch (err) {
        console.error('Помилка отримання предметів:', err);
        throw err;
    }
};

export const addGroup = async (newGroup: Group): Promise<void> => {
    try {
        await axios.post('https://schedule-server-rho.vercel.app/api/groups', newGroup);
    } catch (err) {
        console.error('Помилка додавання групи:', err);
        throw err;
    }
};

export const updateGroup = async (groupCode: string, updatedGroup: Group): Promise<void> => {
    try {
        await axios.put(`https://schedule-server-rho.vercel.app/api/groups/${groupCode}`, updatedGroup);
    } catch (err) {
        console.error('Помилка оновлення групи:', err);
        throw err;
    }
};

export const deleteGroup = async (groupCode: string): Promise<void> => {
    try {
        await axios.delete(`https://schedule-server-rho.vercel.app/api/groups/${groupCode}`);
    } catch (err) {
        console.error('Помилка видалення групи:', err);
        throw err;
    }
};

export const addTeacher = async (newTeacher: Teacher): Promise<void> => {
    try {
        await axios.post('https://schedule-server-rho.vercel.app/api/teachers', newTeacher);
    } catch (err) {
        console.error('Помилка додавання вчителя:', err);
        throw err;
    }
};

export const updateTeacher = async (teacherId: number, updatedTeacher: Teacher): Promise<void> => {
    try {
        await axios.put(`https://schedule-server-rho.vercel.app/api/teachers/${teacherId}`, updatedTeacher);
    } catch (err) {
        console.error('Помилка оновлення вчителя:', err);
        throw err;
    }
};

export const deleteTeacher = async (teacherId: number): Promise<void> => {
    try {
        await axios.delete(`https://schedule-server-rho.vercel.app/api/teachers/${teacherId}`);
    } catch (err) {
        console.error('Помилка видалення вчителя:', err);
        throw err;
    }
};

export const addCurriculum = async (newCurriculum: Curriculum): Promise<void> => {
    try {
        await axios.post('https://schedule-server-rho.vercel.app/api/curriculums', newCurriculum);
    } catch (err) {
        console.error('Помилка додавання предмету:', err);
        throw err;
    }
};

export const updateCurriculum = async (curriculumId: number, updatedCurriculum: Curriculum): Promise<void> => {
    try {
        await axios.put(`https://schedule-server-rho.vercel.app/api/curriculums/${curriculumId}`, updatedCurriculum);
    } catch (err) {
        console.error('Помилка оновлення предмету:', err);
        throw err;
    }
};

export const deleteCurriculum = async (curriculumId: number): Promise<void> => {
    try {
        await axios.delete(`https://schedule-server-rho.vercel.app/api/curriculums/${curriculumId}`);
    } catch (err) {
        console.error('Помилка видалення предмету:', err);
        throw err;
    }
};

export const getPairsByCriteria = async (criteria: {
    semester: number;
    groupId?: string | null;
    teacherId?: number | null;
    weekNumber: number;
    dayNumber: string;
    pairNumber: number;
}): Promise<Pair[]> => {
    try {
        console.log(criteria);
        const response = await axios.get('https://schedule-server-rho.vercel.app/api/getPairsByCriteria', {
            params: criteria
        });

        const pairs: Pair[] = response.data.map((pair: any) => ({
            ...pair,
            semester_number: parseInt(pair.semester_number, 10),
            week_number: parseInt(pair.week_number, 10),
            pair_number: parseInt(pair.pair_number, 10)
        }));
        console.log(criteria);

        console.log(pairs);


        return pairs;
    } catch (err) {
        console.error('Помилка отримання пар за критеріями:', err);
        throw err;
    }
};

export const addPair = async (pairData: Pair): Promise<void> => {
    try {
        const { id, groups_list, teachers_list, ...rest } = pairData; 

        const formattedPairData = {
            ...rest,
            groups_list: groups_list ? JSON.stringify(groups_list) : JSON.stringify([]),
            teachers_list: teachers_list ? JSON.stringify(teachers_list) : JSON.stringify([])
        };

        console.log(formattedPairData);


        await axios.post('https://schedule-server-rho.vercel.app/api/addPair', formattedPairData);
    } catch (err) {
        console.error('Помилка додавання пари:', err);
        throw err;
    }
};

export const editPair = async (pairData: Pair, criteria: {
    semester: number;
    groupId?: string | null;
    teacherId?: number | null;
    weekNumber: number;
    dayNumber: string;
    pairNumber: number;
}): Promise<void> => {
    try {
        
        const pairs = await getPairsByCriteria(criteria);
        const pair = pairs[0];

        if (!pair) {
            throw new Error('Пара не знайдена');
        }

        const newId = pair.id;

        const { id, ...rest } = pairData; 

        const formattedPairData = {
            ...rest,
            id: newId, 
            groups_list: pairData.groups_list ? JSON.stringify(pairData.groups_list) : JSON.stringify([]),
            teachers_list: pairData.teachers_list ? JSON.stringify(pairData.teachers_list) : JSON.stringify([]),
            audience: pairData.audience ? pairData.audience : null
        };

        await axios.put('https://schedule-server-rho.vercel.app/api/editPair', formattedPairData);
    } catch (err) {
        console.error('Помилка редагування пари:', err);
        throw err;
    }
};

export const deletePair = async (pairId: number): Promise<void> => {
    try {
        await axios.delete(`https://schedule-server-rho.vercel.app/api/deletePair/${pairId}`);
    } catch (err) {
        console.error('Помилка видалення пари:', err);
        throw err;
    }
};