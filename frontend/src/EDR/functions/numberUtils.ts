export const getNumberSign = (num: number) => {
    switch (Math.sign(num)) {
        case -1:
            return '-'
        case 1:
            return '+';
        default:
            return '';
    }
}
