// CHAPTER 4 - Arrays and Objects

// Page 60 - 66

//                               ARRAY

const numberArray = [5, 4, 3, 2, 1];
console.log(numberArray[0]); // access

// .splice = (startIndex,sliceCount)
numberArray.splice(0, 0); // mutates original array
console.log("Length of String: \t" + numberArray.length);
numberArray.push("some"); // insert non heterogenuous array
console.log(numberArray);

const string1 = "helicopter";
console.log(typeof string1.toUpperCase);
console.log(typeof string1.toUpperCase());

//                               OBJECT

const day1 = {
  change: false,
  events: ["work", "pizza"],
  "space separated property name": "access through square brackets",
  toBeDeleted: "through del operator",
};

console.log(day1);

day1["change"]; // access
day1.change; // also access
day1.events[0]; // positional access
day1.change = "some other value"; // change value
console.log(day1["space separated property name"]);
console.log(day1["undefined property"]); // undefined

day1["toBeDeleted"] = undefined; // bind property to undefined
delete day1["toBeDeleted"]; // delete property from object

console.log("After Manipulation");
console.log(day1);

const target = {};

Object.keys(day1); // get keys of object
Object.values(day1); // get values of object
const source = { a: 1, b: 2 };
Object.assign(target, source); // upsert all properties of source to target
const source2 = { b: 3, c: 4 };
Object.assign(target, source2); // upsert all properties of source to target

console.log(target);

const object1 = { value: 10 };
const object2 = object1; // object1 and object2 points to same object
const object3 = { value: 10 };

console.log(object1 == object2);
console.log(object1 == object3); // different identity

console.log();
console.log();

// Page 67, 68

// phi() : Correlation

// phi coeffecient - correlation between two phenomenons i and j measured by occurrences, represented from -1 to 1 (low to high)
// n[s:boolean][p:boolean]

// mux(XNOR) - mux(XOR)
// n[1][1] * n[0][0] - n[1][0] * n[0][1] / sqrt(sumOfPTrue*sumOfJTrue*sumOfIFalse*sumOfJFalse)

//          no event        event
// no s     76              9
// s        4               1

//          pIndex ?

const n = [
  [76, 9],
  [4, 1],
];
const nEmpty = [
  [0, 0],
  [0, 0],
];

console.table(n);

const phi = (n) => {
  event1Col = 1;
  const xnor = n[1][1] * n[0][0];
  const xor = n[1][0] * n[0][1];

  const sumOfSFalse = n[0][0] + n[0][1];
  const sumOfSTrue = n[1][0] + n[1][1];
  const sumOfEFalse = n[0][0] + n[1][0];
  const sumOfETrue = n[0][1] + n[1][1];

  return (
    (xnor - xor) /
    Math.sqrt(sumOfETrue * sumOfEFalse * sumOfSTrue * sumOfSFalse)
  );
};

console.log(phi(n));
console.log();
console.log();

// Page 69 - 72
// sum the correlations of each entry (event ? and presence? )

const { JOURNAL: journal } = require("./chapter4_data");
/* JOURNAL ELEMENT
{
  events: [ 'bread', 'pudding', 'brushed teeth', 'weekend', 'touched tree' ],
  squirrel: false
}
*/

const initialize = (journal) => {
  const eventsTable = {};
  for (const entry of journal) {
    for (const event of entry.events) {
      if (!eventsTable.event) {
        eventsTable[event] = [
          [0, 0],
          [0, 0],
        ];
      }
    }
  }
  return eventsTable;
};

// get all possible events

eventsTable = initialize(journal);

const addOccurrence = (eventTable, squirrel, event) => {
  eventTable[squirrel ? 1 : 0][event ? 1 : 0] += 1;
};

//for each entry check squirrel and tabulate event
for (const thisEntry of journal) {
  const squirrel = thisEntry.squirrel;
  for (const event in eventsTable) {
    addOccurrence(
      eventsTable[event],
      squirrel,
      thisEntry.events.includes(event)
    );
  }
}

// we find eating peanuts and not brushing teeth has a strong correlation with squirrels
const pnt = "peanuts";
const bt = "brushed teeth";
const pt = pnt + bt;
eventsTable[pt] = [
  [0, 0],
  [0, 0],
];

for (const thisEntry of journal) {
  const squirrel = thisEntry.squirrel;
  const event =
    thisEntry.events.includes(pnt) && !thisEntry.events.includes(bt);
  addOccurrence(eventsTable[pt], squirrel, event);
}

console.log("Sample");
for (const event of ["carrot", "exercise", "weekend", "bread", "pudding"]) {
  console.log(event + " " + phi(eventsTable[event]));
}

console.log();
console.log();

console.log("All Events");

for (const event in eventsTable) {
  console.log(event + " \t\t\t" + phi(eventsTable[event]));
  console.table(eventsTable[event]);
}

// Page 73 - 74

// Array methods

const array1 = [0, 1, 2, 3, 4];

array1.push(5); // (enqueue)
array1.pop(); // returns value 5 (pop from back)

array1.shift(1); // remove from front (deque)
array1.unshift(0); // add from front
console.log(array1);

// indexOf / lastIndexOf returns -1 if value not found
console.log(array1.indexOf(0, 1)); // search from index 1. first index of value 0
console.log(array1.lastIndexOf(1)); // search from back. returns last index of value 0

const start = 0;
const below = 4;
const nextStart = below;

console.log(array1.slice(start, below)); // slice does not mutate array. return

console.log(array1.slice(start, below).concat(array1.slice(nextStart))); // array1.concat(array2)

// Page 75 - 76
// strings are array-like but are not objects

const string2 = " abcdef \n";

string2.indexOf("a"); // 0
string2[0]; // "a"

string2.indexOf("ab"); // 0 - start index of substring
string2.slice(); // return "abcdef \n"
string2.trim(); // return "abcdef" - remove trailing and leading whitespace and terminators

const totalLength = 20;
string2.trim().padStart(totalLength, "-"); // leftpadded
const delimiter = "c";
string2.split(delimiter); // return String array with "c" as delimiter

"a".repeat(3); // "aaa"
string2.length; // includes whitespace

// Page 76 - 77

// rest parameters

const foo = (...args) => {
  // comma separated args as a Array

  console.log(args);
};

const paramsArray = ["a", "b"];

foo(...paramsArray, ...paramsArray); // destructure array to comma-separated array

// Page 77 - 78

// Math

const n1 = 1,
  n2 = 3;
Math.min(n1, n2); // 1
Math.max(n2, n1); // 3
Math.sqrt(4); // 2
const pi = Math.PI; // built-in constant
Math.random(); // seeded [0,1)
const randomAngle = () => {
  return Math.random() * 2 * pi; // in radians
};

const randomPoint = (radius) => {
  const angle = randomAngle();
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  return { x, y };
};

console.log(randomPoint(2));
Math.floor(3.4) == 3;
Math.ceil(3.4) == 4;
Math.round(3.5) == 4;
Math.round(3.3) == 3;

console.log(parseInt(Math.random() * 10));
console.log(Math.floor(Math.random() * 10));

// Page 79 - 82

// Destructuring (continue)

const destructArgs = ([r, t, u]) => {
  console.log(r + " " + t + " " + u);
};
argArray = [1, 2, 3];
destructArgs(argArray);

//JSON Serialization

jsonObj = {
  prop1: 1,
  prop2: "hello",
};

jsonString = JSON.stringify(jsonObj);

console.log(JSON.parse(jsonString) != jsonObj); // objects inequality
console.log(JSON.parse(jsonString) !== jsonObj); // objects inequality
console.log(JSON.stringify(JSON.parse(JSON.stringify(jsonObj))) == jsonString); // strings are equal

// Page 82

// exercise

// get interval from start to end as array, negative intervals are supported

const range = (start, endingWith, interval = 1) => {
  if (interval < 0) {
    interval = -interval;
    [start, endingWith] = [endingWith, start];
  }
  const Array = [];
  for (let i = start; i <= endingWith; i += interval) {
    Array.push(i);
  }
  return Array;
};
// sum array of integers

const sum = (intArray) => {
  return intArray.length ? intArray.reduce((acm, int) => acm + int) : 0;
};

console.log(sum(range(1, 10)));
console.log(sum(range(1, 13, 7)));
console.log(sum(range(13, 1, -7)));
console.log(sum(range(13, 1, 0)));

// in place reverse array

const reverseInPlace = (array) => {
  for (let i = 0; i < Math.floor(array.length / 2); i++) {
    [array[i], array[array.length - 1 - i]] = [
      array[array.length - 1 - i],
      array[i],
    ];
  }
};

const nArray = [1, 2, 3];
console.log(nArray);
reverseInPlace(nArray); // nArray = [3,2,1]
console.log(nArray);

const reverseAsNew = (array) => {
  const nArray = [];
  for (let i = 0; i < array.length; i++) {
    nArray.push(array[array.length - i - 1]);
  }
  return nArray;
};

const reversedArray = reverseAsNew(nArray);
console.log(reversedArray);

// Page 83

const list1 = { 1: "a", 2: "b" };

const listObj = {
  101: list1,
  102: list1, // same binding
};

listObj["101"] == listObj["102"];
listObj["101"]["1"] = "c";
listObj["102"]["1"] == "c";
listObj["101"]["1"] == listObj["102"]["1"];

// build a structure such that the next element is in the next nested property object

const nest = (valArray) => {
  const root = {};
  let parent = root;
  let idx = 0;
  while (idx < valArray.length) {
    const thisObj = {
      value: valArray[idx],
      rest: null,
    };
    parent.rest = thisObj;
    parent = thisObj;
    idx++;
  }
  return root.rest;
};

const helperNest = (obj, valArray, index) => {
  if (index < valArray.length) {
    obj.rest = {
      value: valArray[index],
      rest: null,
    };
    helperNest(obj.rest, valArray, index + 1);
  }
};
const nestRecursive = (valArray) => {
  const obj = {};
  helperNest(obj, valArray, 0);

  return obj.rest;
};

const numArray = [1, 2, 3, 4];
const nested = nest(numArray);
const recursedNest = nestRecursive(numArray);

console.log(nested);
console.log(recursedNest);

const readNest = (nestedObj) => {
  while (nestedObj) {
    console.log(nestedObj.value);
    nestedObj = nestedObj.rest;
  }
};

readNest(nested);
readNest(recursedNest);

const a = 1;
const b = 1;
