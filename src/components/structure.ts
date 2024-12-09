
export enum Weekday {
    Monday = "Понеділок",
    Tuesday = "Вівторок",
    Wednesday = "Середа",
    Thursday = "Четвер",
    Friday = "П'ятниця",
    Saturday = "Субота",
}

export enum PairType {
    Lecture = "Лекція",
    Practice = "Практика",
    Laboratory = "Лабораторна"
}

export enum PairFormat {
    Offline = "В аудиторії",
    Online = "Онлайн"
}

export enum WeekNumbers {
    Week_1 = 1,
    Week_2 = 2
}

type Dictionary = {
    [key: number]: string;
};

export const PairTime: Dictionary = {
    1: "08:30",
    2: "10:25",
    3: "12:20",
    4: "14:15",
    5: "16:10",
    6: "18:30",
    7: "20:20"
};

export enum AbbrPair {
    Assistant = "ac",
    Teacher = "вик",
    Senior_teacher = "ст.вик",
    Docent = "доц",
    Professor = "проф",
    Unknown = "невідомо"
};

class Pair {
    private name: string | string[];
    private type: PairType | PairType[];
    private format: PairFormat | PairFormat[];
    private building: number | null;
    private audience: number | null;

    constructor(name: string | string[], type: PairType | PairType[], format: PairFormat | PairFormat[], building: number | null, audience: number | null) {
        this.name = name;
        this.type = type;
        this.format = format;
        this.building = building;
        this.audience = audience;
    }

    public getName(): string | string[] {
        return this.name;
    }

    public getType(): PairType | PairType[] {
        return this.type;
    }

    public getFormat(): PairFormat | PairFormat[] {
        return this.format;
    }

    public getBuilding(): number | null {
        return this.building;
    }

    public getAudience(): number | null {
        return this.audience;
    }

    public serialize(): any {
        return {
            name: this.name,
            type: this.type,
            format: this.format,
            building: this.building,
            audience: this.audience
        };
    }

    public static deserialize(data: any): Pair {
        return new Pair(data.name, data.type, data.format, data.building, data.audience);
    }
}

export interface TeacherData {
    id: number;
    full_name: string;
    department: string;
}

export type Teacher = [number | number[], string | string[], AbbrPair | AbbrPair[], ];

export class GroupPair extends Pair {
    private teacher: Teacher;

    constructor(name: string | string[], teacher: Teacher, type: PairType | PairType[], format: PairFormat | PairFormat[], building: number | null, audience: number | null) {
        super(name, type, format, building, audience);
        this.teacher = teacher;
    }

    public getTeacher(): Teacher {
        return this.teacher;
    }

    public serialize(): any {
        return {
            ...super.serialize(),
            teacher: this.teacher
        };
    }

    public static deserialize(data: any): GroupPair {
        return new GroupPair(data.name, data.teacher, data.type, data.format, data.building, data.audience);
    }
}

export class TeacherPair extends Pair {
    private group: string | string[];

    constructor(name: string | string[], group: string | string[], type: PairType | PairType[], format: PairFormat | PairFormat[], building: number | null, audience: number | null) {
        super(name, type, format, building, audience);
        this.group = group;
    }

    public getGroup(): string | string[] {
        return this.group;
    }

    public serialize(): any {
        return {
            ...super.serialize(),
            group: this.group
        };
    }

    public static deserialize(data: any): TeacherPair {
        return new TeacherPair(data.name, data.group, data.type, data.format, data.building, data.audience);
    }
}

export type PairArray = [GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null];

export interface Day {
    pairs: PairArray;
    dayOfWeek: Weekday;
}

export type Week = Array<Day>;

interface Schedule {
    week_1: Week | null;
    week_2: Week | null;
}

export interface GroupSchedule extends Schedule {
    groupName: string;
    [key: string]: Week | string | null;
}

export interface TeacherSchedule extends Schedule {
    id: number;
    name: string;
}