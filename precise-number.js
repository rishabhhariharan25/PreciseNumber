export class PreciseNumber {
    constructor(value, mode = 'decimal') {
        this.mode = mode;
        if (this.mode === 'decimal') {
            if (value instanceof PreciseNumber && value.mode === 'decimal') {
                this.base = value.base;
                this.exponent = value.exponent;
                return;
            }
            const { base, exponent } = PreciseNumber._parseDecimal(value);
            this.base = base;
            this.exponent = exponent;
        } else {
            this.value = Number(value);
        }
    }

    static _fromParts(base, exponent) {
        const instance = Object.create(PreciseNumber.prototype);
        instance.mode = 'decimal';
        instance.base = base;
        instance.exponent = exponent;
        return instance;
    }

    static _parseDecimal(value) {
        let str = value.toString().trim();
        let sciExp = 0;

        // Handle scientific notation like "1.23e-10" or "5e+21"
        if (str.includes('e') || str.includes('E')) {
            const [mantissa, expPart] = str.split(/[eE]/);
            str = mantissa;
            sciExp = parseInt(expPart, 10);
        }

        if (str.includes('.')) {
            const [intPart, fracPart] = str.split('.');
            return {
                base: BigInt(intPart + fracPart),
                exponent: sciExp - fracPart.length
            };
        }

        return {
            base: BigInt(str),
            exponent: sciExp
        };
    }

    preciseCalc(other, operation) {
        const rhs = other instanceof PreciseNumber ? other : new PreciseNumber(other, this.mode);

        if (this.mode === 'binary' && rhs.mode === 'binary') {
            switch (operation) {
                case '+': return new PreciseNumber(this.value + rhs.value, 'binary');
                case '-': return new PreciseNumber(this.value - rhs.value, 'binary');
                case '*': case '×': return new PreciseNumber(this.value * rhs.value, 'binary');
                case '/': case '÷': return new PreciseNumber(this.value / rhs.value, 'binary');
                default: throw new UnsupportedOperationError(operation);
            }
        }

        const num1 = this.mode === 'decimal' ? this : new PreciseNumber(this.value, 'decimal');
        const num2 = rhs.mode === 'decimal' ? rhs : new PreciseNumber(rhs.value, 'decimal');

        let targetExp = Math.min(num1.exponent, num2.exponent);
        const scale1 = 10n ** BigInt(num1.exponent - targetExp);
        const scale2 = 10n ** BigInt(num2.exponent - targetExp);
        let newBase = 0n;

        switch (operation) {
            case '+':
                newBase = (num1.base * scale1) + (num2.base * scale2);
                break;
            case '-':
                newBase = (num1.base * scale1) - (num2.base * scale2);
                break;
            case '*': case '×':
                newBase = num1.base * num2.base;
                targetExp = num1.exponent + num2.exponent;
                break;
            case '/': case '÷':
                if (num2.base === 0n) throw new RangeError('Division by zero');
                newBase = (num1.base * (10n ** 22n)) / num2.base;
                targetExp = num1.exponent - num2.exponent - 22;
                break;
            default:
                throw new UnsupportedOperationError(operation);
        }

        return PreciseNumber._fromParts(newBase, targetExp);
    }

    toString() {
        if (this.mode !== 'decimal') return String(this.value);
        if (this.base === 0n) return '0';

        const isNegative = this.base < 0n;
        const absStr = (isNegative ? -this.base : this.base).toString();
        const sign = isNegative ? '-' : '';

        if (this.exponent >= 0) {
            return sign + absStr + '0'.repeat(this.exponent);
        }

        const absExp = Math.abs(this.exponent);
        let result;
        if (absStr.length > absExp) {
            const dotIndex = absStr.length - absExp;
            result = absStr.slice(0, dotIndex) + '.' + absStr.slice(dotIndex);
        } else {
            result = '0.' + '0'.repeat(absExp - absStr.length) + absStr;
        }

        // Strip trailing fractional zeros (e.g., "0.30" -> "0.3", "2.00" -> "2")
        return sign + result.replace(/\.?0+$/, '');
    }
}

export class UnsupportedOperationError extends Error {
    constructor(operation) {
        super(`Unsupported operation: ${operation}`);
        this.name = 'UnsupportedOperationError';
    }
}
