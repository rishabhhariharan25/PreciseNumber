# PreciseNumber
A small JavaScript library which people can just import via npm or Git to make precise decimal calculations ideally up to 22 places without binary recurring fractions.

## Installation
Choose the installation method that matches your project setup:

### 1. Via NPM (Standard Package Install)
If you are building a modern JavaScript web app (using Vite, Next.js, Webpack, etc.) or a backend application with Node.js, run this in your terminal:

```bash
npm install @rishabhh/precisenumber
```
**Import example:**
```javascript
import { PreciseNumber } from '@rishabhh/precisenumber';

const a = new PreciseNumber(0.1, 'decimal');
const b = new PreciseNumber(0.2, 'binary');

console.log(a.preciseCalc(b, '+').toString()); 
```

---

### 2. Via Git (Clone directly)
If you want to download the source code files directly into your local machine using the Git command line:

```bash
git clone https://github.com/rishabhhariharan25/PreciseNumber
```
Simply copy the `precise-number.js` file straight into your source code directory.

---

### 3. Via Web/Browser (No Terminal / Quick Prototyping)
You don't need a development environment or build tools to test or use this class. You can download or copy the code straight out of GitHub.

#### Option A: Vanilla HTML Script Tag
Create an `index.html` file anywhere on your computer and import your file dynamically as an ES Module:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PreciseNumber Test</title>
</head>
<body>
    <script type="module">
        import { PreciseNumber } from './precise-number.js';
        
        const price = new PreciseNumber(0.1, 'decimal');
        console.log(price.toString());
    </script>
</body>
</html>
```

#### Option B: Raw Browser Console
1. Open the `PreciseNumber.js` file here on GitHub.
2. Click the **Raw** button to get the clean text.
3. Copy the entire class definition code.
4. Press `F12` or right-click your browser page -> **Inspect** -> navigate to the **Console** tab.
5. Paste the code directly into the prompt (remove the word `export` from the first line if it gives you a syntax block error) and press **Enter**. You can now instantiate and experiment with `new PreciseNumber()` directly inside your browser!


## The Library

It has three parts.

### PreciseNumber(value, numberSystem) 

**The constructor.** It creates a new number, and stores it in binary by default or in decimal if specified.

### preciseCalc(other, operation)
**The calculator.** It can make accurate decimal calculations.
`PreciseNumber(0.1, "decimal").preciseCalc(PreciseNumber(0.2, "decimal"), '+');` returns $0.3$ rather than $0.30000000000000004$.

### Only built in operation so far: +. DEVELOPING.

### toString()
Converts a number to a string. If it is a calculation involving numbers more than 22 decimal places apart after the point, an Imprecise flag is added to the start as calculations may not fit in at that point due to JS limitations.
