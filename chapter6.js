// CHAPTER 6 - LIFE OF AN OBJECT

// private / public interface
// lexical scoping (local data, instance data, static data)
//  encapsulation of methods (abstraction)

// methods in a object

// Page 100 - 102

function speak() {
  console.log(`I am a ${this.color}-skinned ${this.animal}`);
}
const whiteRabbit = {
  animal: "rabbit",
  color: "white",
  speak,
};

const blackRabbit = {
  animal: "rabbit",
  color: "black",
  speak,
};

whiteRabbit.speak();
whiteRabbit.speak = () => console.log("somethingelse"); // .speak overwritten
whiteRabbit.speak(); // this = blackRabbit
blackRabbit.speak(); // this = blackRabbit
speak(); // this is undefined

speak.call(whiteRabbit); // global speak with object whiteRabbit as context binding

// arrow function object binding

function someArrow() {
  (() => console.log(this))();
  function some() {
    console.log(this);
  }

  some();
}
someArrow.call({ someProp: "prop" });

const wrapper = () => {
  someArrow();
};

wrapper.call({ someProp: "prop" });

// Page 103 - 107

// Prototypes

// Root object

Object.getPrototypeOf(Object.prototype) == null;
Object.prototype == Object.getPrototypeOf({});
Function.prototype == Object.getPrototypeOf(() => {});
Array.prototype == Object.getPrototypeOf([]);

const protoAnimal = {
  speak,
};

const dog = Object.create(protoAnimal);
dog.animal = "dog";
dog.color = "pink";
dog.speak();

// Constructors

function Animal(type, color = "transparent") {
  const animal = Object.create(protoAnimal); // instance prototype = protoAnimal
  animal.animal = type;
  animal.color = color;
  return animal;
}

const fish = new Animal("fish");

fish.speak();

const cow = new Animal("cow", "brown");

// prototype of an instance is its constructor
// prototype of a constructor is Function.prototype

Object.getPrototypeOf(fish) == protoAnimal;
Object.getPrototypeOf(cow) == protoAnimal;

// class

class AnimalClass {
  // underlying root prototype Object.prototype

  constructor(type, color) {
    this.animal = type;
    this.color = color;
  }
  speak = speak;
}
Object.getPrototypeOf(AnimalClass.prototype) == Object.prototype;

const flyingPig = new AnimalClass("flying pig", "blood red");
Object.getPrototypeOf(flyingPig) == AnimalClass.prototype;

flyingPig.speak();

const instance = new (class {
  singleSome() {
    console.log(" singleton hello ");
  }
})();
console.log(Object.getPrototypeOf(instance));
instance.singleSome();

protoAnimal.teeth = "unknown number";
dog.teeth == fish.teeth; // objects prototypes are protoAnimal, properties of prototypes are inherited

dog.teeth = "roar";

dog.teeth != fish.teeth; // objects properties will supercede prototypes properties

Object.prototype.toString != Array.prototype.toString;

// Page 108 - 109

// Maps vs Objects

const obj = { a: 1 };
"a" in obj == true;
"toString" in obj == true; // find all property names (including object prototypes)
obj.hasOwnProperty("toString") == false; // only own property

// null object

const nullObj = Object.create(null);
"toString" in nullObj == false; // no built-in Object.prototype.properties
const m1 = new Map();
m1.set("a", 1);
m1.get("a") == 1;
m1.has("toString") == false;

protoAnimal.toString = function () {
  // prototypes of some animals
  return `${this.color} ${this.animal}`;
};

Object.getPrototypeOf(dog) == protoAnimal;
console.log(String(dog));
console.log(String(fish));

// Page 101 - 113

// Symbols and Iterators

// property name as a symbol.

const sym = Symbol("someName"); // Each symbol is a unique object instance
typeof Symbol == "function"; // Interface
sym.valueOf().toString() == sym.toString(); // Symbol(someName)
sym.toString();
const someObj = {
  [sym]: "someValue",
  someName: "someValue",
};
console.log(someObj);

// method as a symbol
// Use case: alternate methods

const toStringOutSym = Symbol("toString");

Array.prototype[toStringOutSym] = function () {
  console.log(this.toString());
};
[1, 2, 3][toStringOutSym]();

const it = "OK"[Symbol.iterator]();
let { value, done } = it.next();
value == "O";
done == false;
let { value: value1, done: done1 } = it.next();
value1 == "K";
done1 == false;
let { value: value2, done: done2 } = it.next();
value2 == "O";
done2 == true;

// Iterator Interface

// Example : Matrix

class Matrix {
  constructor(h, w, getValue = (x, y) => undefined) {
    this.height = h;
    this.width = w;
    this.matrix = [];
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        const some = getValue(w, h);
        this.matrix[this.position(w, h)] = some;
      }
    }
    this[Symbol.iterator] = function () {
      return new MatrixIterator(this);
    };
  }

  position(x, y) {
    if (!(x < this.width) || !(y < this.height)) {
      throw Error;
    }
    return y * this.width + x;
  }

  get(x, y) {
    return this.matrix[this.position(x, y)];
  }

  set(x, y, value) {
    this.matrix[this.position(x, y)] = value;
  }
}
// for loops will extract properties value and done

class MatrixIterator {
  constructor(matrix) {
    this.x = 0;
    this.y = 0;
    this.matrix = matrix;
    this.done = false;
  }
  next() {
    if (this.y == this.matrix.height) {
      return { done: true };
    }
    let value = {
      x: this.x,
      y: this.y,
      value: this.matrix.get(this.x, this.y),
    };
    this.nextXY();

    return { value, done: this.done };
  }

  nextXY() {
    if (this.x < this.matrix.width - 1) {
      this.x += 1;
    } else if (this.x == this.matrix.width - 1) {
      this.x = 0;
      this.y += 1;
    }
    if (this.x == this.matrix.width && this.y == this.matrix.height) {
      this.done = true;
    }
  }
}

const matrix = new Matrix(4, 5, (x, y) => x * y);

console.log(matrix[Symbol.iterator]);

const table = [];
for (let { x, y, value } of matrix) {
  // operates on Iterator instance
  if (!table[x]) {
    table[x] = [];
  }
  table[x][y] = value;
}
console.table(table);

for (let { x, y, value } of matrix) {
  if (!table[x]) {
    table[x] = [];
  }
  table[x][y] = value;
}

console.table(table);

// Page 114 - 118

// Getters, Setters and Statics of Classes

// functional getter / setter / static
class Size {
  constructor(size) {
    this.size = size;
  }
  get upSize() {
    return this.size * 2;
  }

  static fromUpSize(upsize) {
    return new Size(upsize / 2);
  }
  static fromSize(size) {
    return new Size(size);
  }
}

const size1 = new Size(19);
size1.upSize == 38;
const size2 = Size.fromUpSize(38);
size2.size == 19;
const size3 = Size.fromSize(19);
size3.upSize == 38;

//  Class Inheritance

class SymmetricMatrix extends Matrix {
  constructor(side, getValue = (x, y) => x * y) {
    super(side, side, (x, y) => {
      return x < y ? getValue(x, y) : getValue(y, x);
    });
  }

  set(x, y, value) {
    super.set(x, y, value);
    if (x != y) {
      super.set(y, x, value);
    }
  }
}

const symMatrix = new SymmetricMatrix(5, (x, y) => x * y);
const symTable = [];

for (const { x, y, value } of symMatrix) {
  if (!symTable[x]) {
    symTable[x] = [];
  }
  symTable[x][y] = value;
}

console.table(symTable);

symMatrix instanceof Matrix == true;
symMatrix instanceof SymmetricMatrix == true;
matrix instanceof Matrix == true;
matrix instanceof SymmetricMatrix == false;

// Page 119

// Exercise

// class Vec : 2 dimensional vector in euclidean plane

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get lengthFromOrigin() {
    return this.length;
  }
  get length() {
    return Math.sqrt(this.x * this.x + Math.pow(this.y, 2));
  }
}

const vector1 = new Vec(3, 4);
vector1.length = 5;
vector1.lengthFromOrigin == vector1.length;

// customized Set = Group

class Group {
  constructor() {
    this.group = new Set();
  }
  add(key) {
    if (!this.has(key)) {
      this.group.add(key);
    }
  }
  delete(key) {
    if (this.has(key)) {
      this.group.delete(key);
    }
  }
  has(key) {
    return this.group.has(key);
  }

  static toGroup(iterable) {
    const group = new Group();
    for (const it of iterable) {
      group.add(it);
    }
    return group;
  }
}

const iterable = [1, 2, 4, 3, 4, "1"];

const grp = Group.toGroup(iterable);
console.log(grp);
