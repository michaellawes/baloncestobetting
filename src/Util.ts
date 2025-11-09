export const generateId = () => {
    const S4 = () => {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export const oddsToDecimal = (value: number) => {
    if (value > 0) {
        return (1 + (value/100))
    } else {
        return 1 - (100/value)
    }
}

export const decimalToOdds = (decimal: number) => {
    if (decimal >= 2) {
        return (decimal - 1) * 100
    } else {
        return -100 / (decimal - 1)
    }
}

