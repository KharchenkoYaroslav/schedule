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