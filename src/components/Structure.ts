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
    6: "18:30"
};


export enum AbbrPair {
    Assistant = "ac",
    Teacher = "вик",
    Senior_teacher = "ст.вик",
    Docent = "доц",  
    Professor = "проф"
};



class Pair {
    private name: string;
    private type: PairType | PairType[];
    private format: PairFormat | PairFormat[];

    constructor(name: string, type: PairType | PairType[], format: PairFormat | PairFormat[]) {
        this.name = name;
        this.type = type;
        this.format = format;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): PairType | PairType[] {
        return this.type;
    }

    public getFormat(): PairFormat | PairFormat[] {
        return this.format;
    }
}

export class GroupPair extends Pair {
    private teacher: string | string[];
    private position: AbbrPair | AbbrPair[];

    constructor(name: string, teacher: string | string[], position: AbbrPair| AbbrPair[], type: PairType | PairType[], format: PairFormat | PairFormat[]) {
        super(name, type, format); 
        this.teacher = teacher;
        this.position = position;
    }

    public getTeacher(): string | string[] {
        return this.teacher;
    }
    public getPosition(): AbbrPair| AbbrPair[]{
        return this.position;
    }
}

export class TeacherPair extends Pair {
    private group: string | string[];

    constructor(name: string, group: string | string[], type: PairType | PairType[], format: PairFormat | PairFormat[]) {
        super(name, type, format); 
        this.group = group;
    }

    public getGroup(): string | string[] {
        return this.group;
    }
}

export type PairArray = [GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null, GroupPair | TeacherPair | null];

export interface Day {
    pairs: PairArray;
    dayOfWeek: Weekday;
}

export type Week = [Day | null, Day | null, Day | null, Day | null, Day | null, Day | null];

interface Schedule {
    week_1: Week | null;
    week_2: Week | null;
}

export interface GroupSchedule extends Schedule {
    groupName: string;
}

export interface TeacherSchedule extends Schedule {
    name: string;
}