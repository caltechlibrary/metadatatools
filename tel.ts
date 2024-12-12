export const TELPattern = '^\\+?(\\d{1,3})?[-.\\s]?(\\(?\\d{1,4}\\)?)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$';
export const reTEL = new RegExp(TELPattern);

function stripTEL(tel: string): string {
    return tel.trim().replaceAll(/\D/gi,'');
}

export function normalizeTEL(tel: string): string {
    const bareTel = stripTEL(tel);
    switch (bareTel.length) {
        case 7:
            return `${bareTel.substring(0,3)}-${bareTel.substring(3,)}`
        case 10:
            return `(${bareTel.substring(0,3)}) ${bareTel.substring(3,6)}-${bareTel.substring(6,)}`;
        case 11:
            return `+00${bareTel.substring(0,1)} (${bareTel.substring(1,4)}) ${bareTel.substring(4,7)}-${bareTel.substring(7,)}`;
        case 12:
            return `+0${bareTel.substring(0,2)} (${bareTel.substring(2,5)}) ${bareTel.substring(5,8)}-${bareTel.substring(8,)}`;
        case 13:
            return `+${bareTel.substring(0,3)} (${bareTel.substring(3,6)}) ${bareTel.substring(6,9)}-${bareTel.substring(9,)}`;
        default:
            return tel;
    }
}

export function validateTEL(tel: string): boolean {
    return reTEL.test(tel);
}


