module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: "standard",
  // required to lint *.wpy files
  plugins: ["html"],
  settings: {
    "html/html-extensions": [".html", ".vue", ".wpy"],
  },
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 警告
    "no-extra-boolean-cast": 1, // 不必要的bool转换
    "no-extra-parens": 1, // 非必要的括号
    "no-empty": 1, // 块语句中的内容不能为空
    "no-use-before-define": [1, "nofunc"], // 未定义前不能使用
    complexity: [1, 20], // 循环复杂度 代表内部判断的次数最多为10个 function a() {if () {} else if {} else {}}

    // 错误
    "comma-dangle": [2, "never"], // 对象字面量项尾不能有逗号
    "no-constant-condition": 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-dupe-args": 2, // 函数参数不能重复
    "no-dupe-keys": 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-duplicate-case": 2, // switch中的case标签不能重复
    "no-empty-character-class": 2, // 正则表达式中的[]内容不能为空
    "no-invalid-regexp": 2, // 禁止无效的正则表达式
    "no-func-assign": 2, // 禁止重复的函数声明
    // // "requireStringLiterals": 2, //操作是下列字符串常量之一："undefined"，"object"，"boolean"，"number"，"string"，"function"和"symbol"  typeof 1 == '123'是错误的写法
    "no-unreachable": 2, // 不能有无法执行的代码 function fn() {
    //     x = 1;
    //     return x;
    //     x = 3; // 无法到达的代码
    // }
    "no-unexpected-multiline": 2, // 避免多行表达式
    "no-sparse-arrays": 2, // 禁止稀疏数组， [1,,2]
    // "no-shadow-restricted-names": 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    "no-cond-assign": 2, // 禁止在条件表达式中使用赋值语句
    "no-trailing-spaces": 2, //一行最后不允许有空格

    // 代码风格
    "no-multi-spaces": 1, // 不能用多余的空格
    "key-spacing": [
      // 正确格式为 {a: 1}
      1,
      {
        // 对象字面量中冒号的前后空格
        beforeColon: false,
        afterColon: true,
      },
    ],
    "no-redeclare": [
      // 禁止重复声明变量
      // 错误写法
      // var a = 3;
      // var a = 10;
      2,
      {
        // 扩展到全局变量
        builtinGlobals: true,
      },
    ],
    "no-unused-expressions": [
      2,
      {
        // 禁止无用的表达式
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    "no-useless-call": 2, // 禁止不必要的call和apply
    "no-warning-comments": [
      2,
      {
        // 不能有警告备注
        terms: ["todo", "fixme", "any other term"],
        location: "anywhere",
      },
    ],
    curly: 1, // 必须使用 if(){} 中的{}
  },
};
