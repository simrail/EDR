export const getTzNumberSign = (num: number) => {
    return Math.sign(num) === 1 ? '+' : '';
}
