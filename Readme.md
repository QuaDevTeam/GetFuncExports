# @quajs/get-func-exports

Extract function definitions from JavaScript text and convert them to exports.

## Usage

Step 1: Install the package.

```bash
npm i @quajs/get-func-exports
```

Step 2: Import and use it.

```js
import getFuncExports from '@quajs/get-func-exports';

const exported = getFuncExports(`
function sum(a, b) {
  return a + b;
}
`);

console.log(exported.sum(1, 2)); // will get 3
```

## Example

Input text:

```js
function sum(a, b) {
  return a + b;
}

function select1(index) {
  console.log(sum(1, 2));
  if (index === 0) {
    return 'section1-select-2';
  }
}

const select2 = (index) => {
  const t = () => {
    setTimeout(() => {
      console.log(1);
    }, 0);
  };
  function t2() {}
  if (index === 1) {
    return 'section1-select-3';
  }
};
```

Output script:

```js
const exported = Object.create(null);
with (exported) {
  exported.sum = function (a, b) {
    return a + b;
  };

  exported.select1 = function (index) {
    console.log(sum(1, 2));
    if (index === 0) {
      return 'section1-select-2';
    }
  };

  exported.select2 = (index) => {
    const t = () => {
      setTimeout(() => {
        console.log(1);
      }, 0);
    };
    function t2() {}
    if (index === 1) {
      return 'section1-select-3';
    }
  };
}

return exported;
```

The `with` statement maintains the correctness of the reference, all top-level function definitions are transformed into assignments.

So we can use `new Function` to execute the script and get all definitions as exports.

## License

MIT
