// CHAPTER 5 - HIGH ORDER FUNCTIONS

// Page 85 - 88

// Abstraction over functions

// example: repeat function f, n times

const repeat = (foo, args, n) => {
  while (n > 0) {
    foo(args);
    n--;
  }
};

repeat(console.log, "", 3);

// example: reusable function to check bound

const lowerBound = (x) => {
  return (y) => y > x;
};

const one = 1;
const zero = 0;
const two = 2;
const lbOne = lowerBound(one);

lbOne(two) == true;
lbOne(zero) == false;

// control flow with high order function

const flowOfResult = (testResult, doTrue, doFalse) => {
  testResult ? doTrue() : doFalse();
};

flowOfResult(
  true,
  () => console.log("true"),
  () => console.log("false")
);

const nextFunctionOfTest = (test, doTrue, doFalse) =>
  test() ? doTrue : doFalse;
const randomBoolean = () => (Math.floor(Math.random() * 10) < 5 ? false : true);
const nextFunction = nextFunctionOfTest(
  randomBoolean,
  () => console.log("less than 5"),
  () => console.log("more or equal to 5")
);
nextFunction();

// For Each / Map Reduce Array Method

array1 = [1, 2, 3, 4];
const callback = (() => (ele) => console.log(ele))();
array1.forEach(callback);

// Page 89 - 93 Data Sets
const unicodeInfoScripts = require("./chapter5_data");

// pure functions
const pureFilter = (scripts, predicate) => {
  const filter = [];

  for (const script of scripts) {
    if (predicate(script)) {
      filter.push(script);
    }
  }

  return filter;
};

const showNamesOfScripts = (scripts) => {
  scripts.forEach((s) => console.log(s.name));
};

const collateSomePropertyOfScripts = (property) => (scripts) => {
  return scripts.reduce((a, s) => {
    a.push(s[property]);
    return a;
  }, []);
};
const collateNamesOfScripts = collateSomePropertyOfScripts("name");

const isLiving = (script) => script.living;
const isNotLiving = (script) => !isLiving(script);
const isDirectionTTB = (script) => script.direction.toLowerCase() == "ttb";

const isCodeBetween = (code) => ([from, below]) => from <= code && code < below;

const code = 121;

const is121inRange = isCodeBetween(code);
const is121inRangeofScript = (script) => script.ranges.some(is121inRange);

const arrayOfScriptsWithCode121 = pureFilter(
  unicodeInfoScripts,
  is121inRangeofScript
);
const scriptNamesWithCode121_names = collateNamesOfScripts(
  arrayOfScriptsWithCode121
);
const livingScripts = pureFilter(unicodeInfoScripts, isLiving);

const livingScriptNames = collateNamesOfScripts(livingScripts);

const scanDownScripts = pureFilter(unicodeInfoScripts, isDirectionTTB);
const scanDownScriptNames = collateNamesOfScripts(scanDownScripts);

showNamesOfScripts(livingScripts);
console.log(livingScriptNames);

showNamesOfScripts(scanDownScripts);
console.log(scanDownScriptNames);

// Page 93 - 95
// Composability

const average = (array) => array.reduce((a, n) => a + n) / array.length;

console.log(average([1, 2, 3])); // 2

//average year of living scripts

const collateYearOfScripts = collateSomePropertyOfScripts("year");

const avgYrLiving = average(
  collateYearOfScripts(pureFilter(unicodeInfoScripts, isLiving))
);
const avgYrNotLiving = average(
  collateYearOfScripts(pureFilter(unicodeInfoScripts, isNotLiving))
);

console.log(avgYrLiving);
console.log(avgYrNotLiving);

console.log(scriptNamesWithCode121_names);

const getScriptSubsetOfCode = (predicate, selectField) => (code) => {
  const cScripts = [];
  for (let s of unicodeInfoScripts) {
    if (predicate(s, code)) {
      cScripts.push(s[selectField]);
    }
  }
  return cScripts;
};

const getValidScriptOfCharacter_names = getScriptSubsetOfCode(
  (s, code) => s.ranges.some(([from, to]) => from <= code && code < to),
  "name"
);
const getScriptDominantDirectionOfCharacter_direction = getScriptSubsetOfCode(
  (s, code) => s.ranges.some(([from, to]) => from <= code && code < to),
  "direction"
);
console.log(
  "getValidScriptOfCharacter_names: " + getValidScriptOfCharacter_names(121)
);
console.log(
  "getScriptDominantDirectionOfCharacter_direction: " +
    getScriptDominantDirectionOfCharacter_direction(121)
);

// Page 96
//  characters
const horse = "🐴";

horse.length == 2; // 2 bytes code unit

horse[0] + horse[1] == horse;

horse.codePointAt(0); // actual code point (full character)
horse.charCodeAt(0); // some other code

const roseDragon = "🌹🐉";

for (const emj of roseDragon) {
  // for each character
  console.log(emj);
}

// Page 97 - 98
// Recognizing Text

const countBy = (items, grouping) => {
  let counts = new Map();
  for (const item of items) {
    const grp = grouping(item);
    if (counts.has(grp)) {
      counts.set(grp, counts.get(grp) + 1);
    } else {
      counts.set(grp, 1);
    }
  }

  return counts;
};

[1, 2, 3].findIndex((e) => e == 3) == 2;

// check unicode script make up of string

const pctLog = (total) => (v, k) =>
  console.log(`${Math.round((v / total) * 100)}% ${k}`);
const percentageLog = (make, predicate) => {
  let total = 0;
  make.forEach((v, k) => (predicate(k) ? (total += v) : 0));
  const pct = pctLog(total);

  make.forEach((v, k) => {
    predicate(k) ? pct(v, k) : 0;
  });
};
// const makeupGeneral = (groupFunction)
const makeupScriptType = (string, groupFunction) => {
  const make = countBy(string, groupFunction);
  console.log("Consider all groups");
  percentageLog(make, () => true);
  console.log("Consider all valid groups");
  percentageLog(make, (k) => k != undefined);

  return make;
};

const makeupGeneral = (groupFunction) => (string) => {
  const make = countBy(string, groupFunction);
  console.log("Consider all groups");
  percentageLog(make, () => true);
  console.log("Consider all valid groups");
  percentageLog(make, (k) => k != undefined);
  return make;
};

makeupGeneral((c) => getValidScriptOfCharacter_names(c.codePointAt(0))[0])(
  '英国的狗说"woof", 俄罗斯的狗说"тяв"'
);
console.log();

// Page 99

// Flattening array of arrays

const arrarr = [["a"], [["b"], ["c", ["d"], ["e"]], "f"], "g"];

const flatten = (arrarr) => {
  if (typeof arrarr == "string") {
    return arrarr;
  }
  initialValue = "";
  return arrarr.reduce((acc, arr) => {
    return acc + flatten(arr);
  }, initialValue);
};

flatten(arrarr) == "abcdefg";

// higher order for-loop

// value, condition, update, body

const genLoopFunction = (initial, condition, update, body) => () => {
  for (let i = initial; condition(i); i = update(i)) {
    body(i);
  }
};

const loop = genLoopFunction(
  0,
  (i) => i < 10,
  (i) => i + 1,
  (i) => console.log(i + " hellogoodbye")
);

loop();

// universal quantifiers
[1, 2, 3].every((n) => n < 10) == true;
[1, 2, 3].every((n) => n < 2) == false;
[1, 2, 3].some((n) => n < 2) == true;
[1, 2, 3].some((n) => n > 2) == true;

// writing direction of string

makeupGeneral((c) => getValidScriptOfCharacter_names(c.codePointAt(0))[0])(
  '英国的狗说"woof", 俄罗斯的狗说"тяв"'
);

makeupGeneral(
  (c) => getScriptDominantDirectionOfCharacter_direction(c.codePointAt(0))[0]
)('英国的狗说"woof", 俄罗斯的狗说"тяв"');

makeupGeneral(
  (c) => getScriptDominantDirectionOfCharacter_direction(c.codePointAt(0))[0]
)('英国的狗说"woof", 俄罗斯的狗说"тяв"');

makeupGeneral(
  (c) => getScriptDominantDirectionOfCharacter_direction(c.codePointAt(0))[0]
)(
  "An abstract data type is realized by writing a special kind of program […] which defines the type in terms of the operations which can be performed on it."
);
