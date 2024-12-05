export const formatTypeAndFormat = (types: string | string[], formats: string | string[]): string => {
    if (!Array.isArray(types)) types = [types];
    if (!Array.isArray(formats)) formats = [formats];

    if (types.length === 1 && formats.length > 1) {
        return `${types[0]}., ${formats.join(', ')}.`;
    } else if (types.length === formats.length) {
        return types.map((type, index) => `${type}, ${formats[index]}`).join('., ') + '.';
    } else if (types.length > 1 && formats.length === 1) {
        return `${types.join(', ')}., ${formats[0]}.`;
    } else {
        return '';
    }
};

export const formatSubject = (subject: string | string[]): string => {
    if (!Array.isArray(subject)) return subject;
    else {
        return `${subject.join(', ')}`;
    }
};

export const transform_name = (fullName: string | undefined): string => {
    if (!fullName) return '';

    const words = fullName.split(' ');

    if (words.length != 3) {
        return fullName;
    }

    const firstWord = words[0];

    const secondInitial = words[1][0] + '.';

    const thirdInitial = words[2][0] + '.';
    return `${firstWord} ${secondInitial}${thirdInitial}`;
}