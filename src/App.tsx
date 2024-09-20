import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import OutputTable from './components/OutputTable';
import {
    Weekday,
    PairType,
    PairFormat,
    WeekNumbers,
    GroupPair,
    TeacherPair,
    GroupSchedule,
    TeacherSchedule,
    AbbrPair
} from './components/Structure';

const App: React.FC = () => {
    const [find, setFind] = useState<string>("");
    const [isValueFound, setIsValueFound] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1);

    const groupsList: GroupSchedule[] = [
        {
            groupName: "ТВ-31",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            groupName: "ТВ-32",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [new GroupPair("Фізичні основи кібер-фізичних систем", "Салюк О. Ю", AbbrPair.Professor, PairType.Lecture, PairFormat.Online), new GroupPair("Бази даних", "Дацюк О. А", AbbrPair.Senior_teacher, PairType.Lecture, PairFormat.Online), new GroupPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", "Гагарін О. О", AbbrPair.Docent, PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, new GroupPair("Теорія ймовірностей", "Свинчук О. В", AbbrPair.Docent, PairType.Lecture, PairFormat.Online), new GroupPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", "Сарибога Г. В", AbbrPair.Senior_teacher, PairType.Lecture, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [new GroupPair("Логіка, Logic, Основи підприємницької діяльності, Єдиноборства, Ігрові види спорту, Циклічні види спорту", ["Потіщук О. О", "Казаков М. А", "Щепіна Т. Г"], [AbbrPair.Teacher, AbbrPair.Teacher, AbbrPair.Docent], [PairType.Lecture, PairType.Practice], PairFormat.Online), new GroupPair("Дизайн презентації для професійної діяльності, Складно-координаційні види спорту", "Парненко В. С", AbbrPair.Assistant, PairType.Lecture, PairFormat.Online), null, null, new GroupPair("Практичний курс іноземної мови. Частина 2", "Кондрашова А. В", AbbrPair.Teacher, PairType.Practice, PairFormat.Online), null] },
                { dayOfWeek: Weekday.Thursday, pairs: [new GroupPair("Фізичні основи кібер-фізичних систем", "Пальцун С. В", AbbrPair.Senior_teacher, PairType.Practice, PairFormat.Online), new GroupPair("Об'єктно-орієнтований аналіз та конструювання програмних систем", "Сарибога Г. В", AbbrPair.Senior_teacher, [PairType.Lecture, PairType.Practice], PairFormat.Online), null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [new GroupPair("Компоненти програмної інженерії. Частина 2. Моделювання програмного забезпечення. Аналіз вимог до програмного забезпечення", "Гагарін О. О", AbbrPair.Docent, PairType.Practice, PairFormat.Online), new GroupPair("Теорія ймовірностей", "Свинчук О. В", AbbrPair.Docent, PairType.Practice, PairFormat.Online), new GroupPair("Бази даних", "Дацюк О. А", AbbrPair.Senior_teacher, PairType.Laboratory, PairFormat.Online), null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            groupName: "ТВ-33",
            week_1: null,
            week_2: null
        },
    ];

    const teachersList: TeacherSchedule[] = [
        {
            name: "Салюк О. Ю",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [new TeacherPair("Фізичні основи кібер-фізичних систем", "ТВ-32", PairType.Lecture, PairFormat.Online), null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] },
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Дацюк О. А",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Гагарін О. О",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Свинчук О. В",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Сарибога Г. В",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Потіщук О. О",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Казаков М. А",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Щепіна Т. Г",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Парненко В. С",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Кондрашова А. В",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
        {
            name: "Пальцун С. В",
            week_1: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ],
            week_2: [
                { dayOfWeek: Weekday.Monday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Tuesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Wednesday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Thursday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Friday, pairs: [null, null, null, null, null, null] },
                { dayOfWeek: Weekday.Saturday, pairs: [null, null, null, null, null, null] }
            ]
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth < 1100) {
                const newScale = currentWidth / 1100;
                setScale(newScale);
            } else {
                setScale(1);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Викликаємо один раз для ініціалізації

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleValueFound = (value: string) => {
        if (groupsList.some(group => group.groupName === value) || teachersList.some(teacher => teacher.name === value)) {
            setIsValueFound(true);
        }
    };

    return (
        <div className="App">
            <div className='Content' style={{ transform: `scale(${scale})`, transition: '0.2s', transformOrigin: 'top left',width:`${100/scale}%`}}>
                <span className="heading">Розклад занять у ВНЗ</span>
                {!isValueFound && (
                    <InputField
                        find={find}
                        setFind={setFind}
                        groupsList={groupsList.map(group => group.groupName)}
                        teachersList={teachersList.map(teacher => teacher.name)}
                        onValueFound={handleValueFound}
                    />
                )}
                {isValueFound && (
                    <OutputTable
                        find={find}
                        setFind={setFind}
                        setIsValueFound={setIsValueFound}
                        groupsList={groupsList}
                        teachersList={teachersList}
                    />
                )}
            </div>
        </div>
    );
}

export default App;