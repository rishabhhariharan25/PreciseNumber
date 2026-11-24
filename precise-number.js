export class PreciseNumber {             
    constructor(value, mode = 'binary') {                 
        this.mode = mode; // 'binary' or 'decimal'                  
        if (this.mode === 'decimal') {                 
            const stringValue = value.toString();                 
            if (stringValue.includes('.')) {                     
                const [decimalPart, fractionalPart] = stringValue.split('.');                     
                this.base = BigInt(decimalPart + fractionalPart);                     
                this.exponent = -fractionalPart.length;                 
            } else {                     
                this.base = BigInt(value);                     
                this.exponent = 0;                 
            }                 
        } else {                 
            this.value = Number(value);                 
        }             
    }              

    preciseCalc(other, operation) {                 
        if (this.mode === 'binary' && other.mode === 'binary') {                 
            if (operation === '+') return new PreciseNumber(this.value + other.value, 'binary'); 
            else if (operation === '-') return new PreciseNumber(this.value - other.value, 'binary');
            else if (operation === '*' || operation === '×') return new PreciseNumber(this.value * other.value, 'binary');
            else if (operation === '/' || operation === '÷') return new PreciseNumber(this.value / other.value, 'binary');                
            else throw new UnsupportedOperationError(operation);
        }                  

        const num1 = this.mode === 'decimal' ? this : new PreciseNumber(this.value, 'decimal');                 
        const num2 = other.mode === 'decimal' ? other : new PreciseNumber(other.value, 'decimal');                  
        let targetExp = Math.min(num1.exponent, num2.exponent);                        
        
        const scale1 = 10 ** (num1.exponent - targetExp);                 
        const scale2 = 10 ** (num2.exponent - targetExp);
        let newBase = 0n;
        switch(operation) {                               
            case '+': newBase = (num1.base * BigInt(scale1)) + (num2.base * BigInt(scale2)); break;
            case '-': newBase = (num1.base * BigInt(scale1)) - (num2.base * BigInt(scale2)); break;
            case '*': case '×': 
                newBase = num1.base * num2.base; 
                targetExp = num1.exponent + num2.exponent;
                break;
            case '/': case '÷':
                if(num2.base === 0n) throw new RangeError('Division by zero');
                newBase = (num1.base * (10n ** 22)) / num2.base;
                targetExp = num1.exponent - num2.exponent - 22;
                break;
            default: throw new UnsupportedOperationError(operation);
        }
        
        const finalValue = resultExp >= 0
            ? PreciseNumber((newBase) * (10 ** resultExp), 'decimal')
            : PreciseNumber((newBase) / (10 ** Math.abs(resultExp)), 'decimal');

return new PreciseNumber(finalValue, 'decimal');

    }              

    toString() {                 
        if (this.mode === 'decimal') {
            // Reconstruct the exact number as a string without doing floating-point division
            let displayValue;
            if (this.exponent === 0) {
                displayValue = this.base.toString();
            } else {
                const baseStr = this.base.toString();
                const isNegative = baseStr.startsWith('-');
                const cleanStr = isNegative ? baseStr.slice(1) : baseStr;
                const absExp = Math.abs(this.exponent);

                if (cleanStr.length > absExp) {
                    const dotIndex = cleanStr.length - absExp;
                    displayValue = (isNegative ? '-' : '') + cleanStr.slice(0, dotIndex) + '.' + cleanStr.slice(dotIndex);
                } else {
                    const padding = '0'.repeat(absExp - cleanStr.length);
                    displayValue = (isNegative ? '-' : '') + '0.' + padding + cleanStr;
                }
            }

            // Check if it hits standard JS number limits where truncation or formatting breaks
            const digitalLength = Math.max(
                this.base.toString().replace('-', '').length, 
                Math.abs(this.exponent)
            );
            
            const prefix = digitalLength > 22 ? "Imprecise: " : "";
            return `${prefix}${displayValue} (Precise Mode)`;
        }
        
        return `${this.value} (Binary Mode)`;
    }         
}

export class UnsupportedOperationError extends Error {
    constructor(operation) {
        super(`Unsupported operation: ${operation}`);
        this.name = 'UnsupportedOperationError';
    }
}
