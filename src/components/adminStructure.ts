export interface Group {
    group_code: string;
    specialty_id: number;
    number_of_students: number;
}

export interface Teacher {
    id: number;
    full_name: string;
    department: string;
    post: string;
}

export interface Specialty {
    id: number;
    specialty_name: string;
}

export interface Curriculum {
    id: number;
    subject_name: string;
    related_teachers: {
        id: string;
        planned_labs: number;
        planned_lectures: number;
        planned_practicals: number;
    }[];
    related_groups: {
        code: string;
        planned_labs: number;
        scheduled_labs: number;
        planned_lectures: number;
        planned_practicals: number;
        scheduled_lectures: number;
        scheduled_practicals: number;
    }[];
    correspondence: boolean;
}

export interface Pair {
    id: number;
    semester_number: number;
    groups_list: string[] | null;
    teachers_list: { id: number; name: string }[] | null;
    subject_id: number;
    week_number: number;
    day_number: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    pair_number: number;
    lesson_type: 'Lecture' | 'Practice' | 'Laboratory';
    visit_format: 'Offline' | 'Online';
    audience: number | null;
}