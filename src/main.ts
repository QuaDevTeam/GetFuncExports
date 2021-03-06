import prettier from 'prettier';
import prettierConfig from './config/prettier';

const namedFuncTester = /^function(\s+)?(\S+)(\s+)?\(/i;
const arrowFuncTester = /^(const|let)(\s+)?(\S+)(\s+)?=(\s+)?([\s\S]+)(\s+)?=>(\s+)?{/gi;
const arrowFuncNameExtractor = /^(const|let)(\s+?)(\S+)(\s+)?=/;

export const getTransformedScript = (text: string) => {
  const formatted = prettier.format(text, prettierConfig);
  const lines = formatted.split('\n');
  const transformed = lines.map((line) => {
    if (namedFuncTester.test(line)) {
      return line.replace(namedFuncTester, 'exported.$2 = function (');
    }
    if (arrowFuncTester.test(line)) {
      console.log(line, line.replace(arrowFuncNameExtractor, 'exported.$3 = '));
      return line.replace(arrowFuncNameExtractor, 'exported.$3 = ');
    }
    return line;
  });
  return `
  const exported = Object.create(null);
  with (exported) {
    ${transformed.join('\n')}
  };

  return exported;
  `.trim();
};

const getExported = (text: string) => {
  // eslint-disable-next-line no-new-func
  const exported = new Function(getTransformedScript(text))() as Record<string, Function>;
  return exported;
};

export default getExported;
