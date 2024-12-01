
import axios from 'axios';
import { Curriculum, Group, Specialty, Teacher } from './adminStructure';

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