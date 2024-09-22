import { AbbrPair, GroupPair, GroupSchedule, PairFormat, PairType, TeacherPair, TeacherSchedule, Weekday } from './structure1';

const getDataGroups = () => {
    const groupsList: GroupSchedule[] = [
        {
            groupName: "ТВ-32",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [new GroupPair("Фізичні основи кібер-фізичних систем", ["Салюк О. Ю", AbbrPair.Professor], PairType.Lecture, PairFormat.Online), new GroupPair("Бази даних", ["Дацюк О. А", AbbrPair.Senior_teacher], PairType.Lecture, PairFormat.Online), new GroupPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", ["Гагарін О. О", AbbrPair.Docent], PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, new GroupPair("Теорія ймовірностей", ["Свинчук О. В", AbbrPair.Docent], PairType.Lecture, PairFormat.Online), new GroupPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", ["Сарибога Г. В", AbbrPair.Senior_teacher], PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [new GroupPair(["Логіка", "Logic", "Основи підприємницької діяльності", "Єдиноборства", "Ігрові види спорту", "Циклічні види спорту"], [["Потіщук О. О", "Казаков М. А", "Щепіна Т. Г"], [AbbrPair.Teacher, AbbrPair.Teacher, AbbrPair.Docent]], [PairType.Lecture, PairType.Practice], PairFormat.Online), new GroupPair(["Дизайн презентації для професійної діяльності", "Складно-координаційні види спорту"], ["Парненко В. С", AbbrPair.Assistant], PairType.Lecture, PairFormat.Online), null, null, new GroupPair("Практичний курс іноземної мови. Частина 2", ["Кондрашова А. В", AbbrPair.Teacher], PairType.Practice, PairFormat.Online), null] },
                { dayOfWeek: Weekday.Thursday, pairs: [new GroupPair("Фізичні основи кібер-фізичних систем", ["Пальцун С. В", AbbrPair.Senior_teacher], PairType.Practice, PairFormat.Online), new GroupPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", ["Сарибога Г. В", AbbrPair.Senior_teacher], PairType.Practice, PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [new GroupPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", ["Гагарін О. О", AbbrPair.Docent], PairType.Practice, PairFormat.Online), new GroupPair("Теорія ймовірностей", ["Свинчук О. В", AbbrPair.Docent], PairType.Practice, PairFormat.Online), new GroupPair("Бази даних", ["Дацюк О. А", AbbrPair.Senior_teacher], PairType.Laboratory, PairFormat.Online), null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [new GroupPair("Фізичні основи кібер-фізичних систем", ["Салюк О. Ю", AbbrPair.Professor], PairType.Lecture, PairFormat.Online), new GroupPair("Бази даних", ["Дацюк О. А", AbbrPair.Senior_teacher], PairType.Lecture, PairFormat.Online), new GroupPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", ["Гагарін О. О", AbbrPair.Docent], PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, new GroupPair("Теорія ймовірностей", ["Свинчук О. В", AbbrPair.Docent], PairType.Lecture, PairFormat.Online), new GroupPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", ["Сарибога Г. В", AbbrPair.Senior_teacher], PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [new GroupPair(["Логіка", "Logic", "Стилі в образотворчому мистецтві", "Єдиноборства", "Ігрові види спорту", "Циклічні види спорту"], [["Сторожик М. І", "Казаков М. А", "Оляніна С. В"], [AbbrPair.Teacher, AbbrPair.Teacher, AbbrPair.Professor]], [PairType.Practice, PairType.Lecture], PairFormat.Online), new GroupPair("Складно-координаційні види спорту", ["", AbbrPair.Unknown], PairType.Practice, PairFormat.Online), new GroupPair("Дизайн презентації для професійної діяльності", ["Парненко В. С", AbbrPair.Assistant], PairType.Practice, PairFormat.Online), new GroupPair(["Стилі в образотворчому мистецтві", "Основи підприємницької діяльності"], [["Оляніна С. В", "Щепіна Т. Г"], [AbbrPair.Professor, AbbrPair.Docent]], PairType.Practice, PairFormat.Online), new GroupPair("Практичний курс іноземної мови. Частина 2", ["Кондрашова А. В", AbbrPair.Teacher], PairType.Practice, PairFormat.Online), null] },
                { dayOfWeek: Weekday.Thursday, pairs: [new GroupPair("Фізичні основи кібер-фізичних систем", ["Пальцун С. В", AbbrPair.Senior_teacher], PairType.Practice, PairFormat.Online), new GroupPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", ["Сарибога Г. В", AbbrPair.Senior_teacher], PairType.Practice, PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [new GroupPair("Бази даних", ["Дацюк О. А", AbbrPair.Senior_teacher], PairType.Practice, PairFormat.Online), new GroupPair("Теорія ймовірностей", ["Свинчук О. В", AbbrPair.Docent], PairType.Practice, PairFormat.Online), new GroupPair("Бази даних", ["Дацюк О. А", AbbrPair.Senior_teacher], PairType.Laboratory, PairFormat.Online), null, null, null] },               
            ]
        },
    ];
    return groupsList;
}

const getDataTeachers = () => {
    const teachersList: TeacherSchedule[] = [
        {
            name: "Салюк О. Ю",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [new TeacherPair("Фізичні основи кібер-фізичних систем", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null, null] },
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [new TeacherPair("Фізичні основи кібер-фізичних систем", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null, null] },
            ]
        },
        {
            name: "Дацюк О. А",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, new TeacherPair("Бази даних", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, new TeacherPair("Бази даних", "ТВ-32", PairType.Laboratory, PairFormat.Online), null, null, null] },
                
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, new TeacherPair("Бази даних", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [new TeacherPair("Бази даних", "ТВ-32", PairType.Practice, PairFormat.Online), null, new TeacherPair("Бази даних", "ТВ-32", PairType.Laboratory, PairFormat.Online), null, null, null] },
                
            ]
        },
        {
            name: "Гагарін О. О",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, new TeacherPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [new TeacherPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null, null] },
                
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, new TeacherPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null] },                
            ]
        },
        {
            name: "Свинчук О. В",
            week_1: [
                { dayOfWeek: Weekday.Tuesday, pairs: [null, new TeacherPair("Теорія ймовірностей", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, new TeacherPair("Теорія ймовірностей", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null] },
                
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, new TeacherPair("Теорія ймовірностей", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, new TeacherPair("Теорія ймовірностей", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null] },
            ]
        },
        {
            name: "Сарибога Г. В",
            week_1: [
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, new TeacherPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, new TeacherPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null] },                
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, new TeacherPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, new TeacherPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null] },                
            ]
        },
        {
            name: "Потіщук О. О",
            week_1: [
                { dayOfWeek: Weekday.Wednesday, pairs: [new TeacherPair("Логіка", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null, null] },                
            ],
            week_2: null,
        },
        {
            name: "Казаков М. А",
            week_1: [
                { dayOfWeek: Weekday.Wednesday, pairs: [new TeacherPair("Logic", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null, null] },                
            ],
            week_2: [
                { dayOfWeek: Weekday.Wednesday, pairs: [new TeacherPair("Logic", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null, null] },                
            ]
        },
        {
            name: "Щепіна Т. Г",
            week_1: [
                { dayOfWeek: Weekday.Wednesday, pairs: [new TeacherPair("Основи підприємницької діяльності", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null, null] },                
            ],
            week_2: [
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, new TeacherPair("Основи підприємницької діяльності", "ТВ-32", PairType.Practice, PairFormat.Online), null, null] },                
            ]
        },
        {
            name: "Парненко В. С",
            week_1: [
                { dayOfWeek: Weekday.Wednesday, pairs: [null, new TeacherPair("Дизайн презентації для професійної діяльності", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null] },
            ],
            week_2: [
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, new TeacherPair("Дизайн презентації для професійної діяльності", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null] },            
            ]
        },
        {
            name: "Кондрашова А. В",
            week_1: [
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, new TeacherPair("Практичний курс іноземної мови. Частина 2", "ТВ-32", PairType.Practice, PairFormat.Online), null] },
            ],
            week_2: [
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, new TeacherPair("Практичний курс іноземної мови. Частина 2", "ТВ-32", PairType.Practice, PairFormat.Online), null] },               
            ]
        },
        {
            name: "Пальцун С. В",
            week_1: [
                { dayOfWeek: Weekday.Thursday, pairs: [new TeacherPair("Фізичні основи кібер-фізичних систем", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null, null] },
            ],
            week_2: [
                { dayOfWeek: Weekday.Thursday, pairs: [new TeacherPair("Фізичні основи кібер-фізичних систем", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null, null] },
            ]
        },
        {
            name: "Сторожик М. І",
            week_1: null,
            week_2: [
                { dayOfWeek: Weekday.Wednesday, pairs: [new TeacherPair("Логіка", "ТВ-32", PairType.Practice, PairFormat.Online), null, null, null, null, null] },    
            ]
        },
        {
            name: "Оляніна С. В",
            week_1: [ 
            ],
            week_2: [
                { dayOfWeek: Weekday.Wednesday, pairs: [new TeacherPair("Стилі в образотворчому мистецтві", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, new TeacherPair("Стилі в образотворчому мистецтві", "ТВ-32", PairType.Practice, PairFormat.Online), null, null] },
            ]
        },
    ];
    return teachersList;
}

export { getDataGroups, getDataTeachers };
