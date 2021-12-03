// Chapter 7 PROJECT

// Page 121 - 124
// Create graph representing routes

"use strict";

const locations = [
  "Alice House",
  "Bob House",
  "Town Hall",
  "Cabin",
  "Ernie House",
  "Grete House",
  "Shop",
  "Market Place",
  "Farm",
  "Post Office",
];

const routes = [
  "Alice House - Bob House",
  "Alice House - Cabin",
  "Alice House - Post Office",
  "Bob House - Town Hall",
  "Daria House - Ernie House",
  "Daria House - Town Hall",
  "Ernie House - Grete House",
  "Grete House - Farm",
  "Grete House - Shop",
  "Market Place - Farm",
  "Market Place - Post Office",
  "Market Place - Town Hall",
  "Shop - Town Hall",
];

class Parcel {
  constructor(pickupLocation, to) {
    this.currentLocation = pickupLocation;
    this.deliveringPoint = to;
    this.delivered = false;
  }

  updateCurrentLocation(loc) {
    this.currentLocation = loc;
  }
  static create(pickup, to) {
    return new Parcel(pickup, to);
  }
  static transferOut(parcelsList, key) {
    const parcels = parcelsList[key];
    delete parcelsList[key];

    console.log(
      "transferring out " + JSON.stringify(parcels) + (parcels || [])
    );
    return parcels ? parcels : [];
  }
  static generateRandomParcels(locations, count) {
    const parcels = [];
    const length = locations.length;

    while (count) {
      const idFrom = Math.floor(Math.random() * length);
      const idTo = Math.floor(Math.random() * length);

      const startLocation = locations[idFrom];
      const endLocation = locations[idTo];
      if (!parcels[startLocation]) {
        parcels[startLocation] = [];
      }

      parcels[startLocation].push(Parcel.create(startLocation, endLocation));
      count--;
    }

    return parcels;
  }
}

const parcelList = Parcel.generateRandomParcels(locations, 5);
class Graph {
  constructor() {
    this.graph = [];
  }
  addDirectedEdge([from, to]) {
    if (!this.graph[from]) {
      this.graph[from] = [];
    }

    this.graph[from].push(to);
  }
  addUndirectedEdge([from, to]) {
    this.addDirectedEdge([from, to]);
    this.addDirectedEdge([to, from]);
  }

  singleHopAway(from, to) {
    return this.graph[from]?.includes(to);
  }
  static fromEdgeStrings(routes, delimiter) {
    const g = new Graph();
    routes.forEach((route) => {
      const [xy, yx] = route.split(delimiter);
      g.addUndirectedEdge([xy, yx]);
    });

    return g;
  }
}

const graph0 = Graph.fromEdgeStrings(routes, " - ");

// create a class State : state of Area

class RobotState {
  constructor(robotLocation, parcels, graph) {
    this.robotLocation = robotLocation;
    this.parcelsUndelivered = [];
    this.parcelsDeliveredHere = [];
    this.getParcels();
    this.sortParcels(parcels);
    this.graph = graph;
  }

  getParcels() {
    console.log("State.robotLoc " + this.robotLocation);
    const grab = Parcel.transferOut(parcelList, this.robotLocation);
    console.log("grab" + JSON.stringify(grab));
    console.log(parcelList);
    this.parcelsUndelivered.push(...grab);
    console.log(parcelList);
  }
  sortParcels(parcels) {
    for (let parcel of parcels) {
      if (parcel.deliveringPoint == this.robotLocation) {
        this.parcelsDeliveredHere.push(parcel);
      } else {
        parcel.updateCurrentLocation(this.robotLocation); // KIV
        this.parcelsUndelivered.push(parcel);
      }
    }
    console.log("parcelsDeliveredHere");
    console.log(this.parcelsDeliveredHere);
  }
  move(nextDst) {
    console.log(`${this.robotLocation} to ${nextDst}`);
    if (this.graph.singleHopAway(this.robotLocation, nextDst)) {
      // check if current robot can move to single hop destination
      return new RobotState(nextDst, this.parcelsUndelivered, this.graph);
    } else {
      console.log("invalid move " + nextDst);
      return this;
    }
  }
}

graph0.addUndirectedEdge(["Unknown A", "Unknown B"]);

class Robot {
  constructor(parcels, route, initialLocation, graph) {
    this.parcels = parcels;
    this.route = route;
    this.initialLocation = initialLocation;
    this.currentLocation = this.initialLocation;
    this.graph = graph;
    this.states = [
      new RobotState(this.initialLocation, this.parcels, this.graph),
    ];
    console.log("First State Location: " + this.states[0].robotLocation);
    console.log(
      "First State Undelivered: " + this.states[0].parcelsUndelivered
    );
    console.log(
      "First State Undelivered: " + this.states[0].parcelsUndelivered
    );
  }

  move() {
    for (const nextLocation of this.route) {
      console.log(
        "here " +
          this.states[this.states.length - 1].robotLocation +
          "nextLocation : " +
          nextLocation
      );
      const nextState = this.states[this.states.length - 1].move(nextLocation);
      this.currentLocation = nextLocation;
      this.states.push(nextState);

      console.log();
    }
  }

  viewStates(...args) {
    if (args) {
      for (const state of this.states) {
        console.log("state @ " + state.robotLocation);
        for (const arg of args) {
          console.log(`${arg}: ` + JSON.stringify(state[arg]));
        }
        console.log();
      }
    } else {
      for (const state of this.states) {
        console.log(JSON.stringify(state));
      }
    }
  }
}

// Page 125

// Persistent Data

const objF = { a: 1 };
Object.freeze(objF);
try {
  objF["a"] = 2;
} catch {
  // catched
}
objF["a"] == 1;

class Node {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.visited = false;
  }

  setChildren(childNode) {
    this.children.push(childNode);
  }
}

class Tree {
  constructor(graphMap, route, initialLocation) {
    this.graphMap = graphMap;
    this.route = route;
    this.initalLocation = initialLocation;
  }

  static genTreeRoute(graphMap, name) {
    const thisMapNode = graphMap.get(name);
    const thisName = thisMapNode.name;

    let some = [];
    for (const c of thisMapNode.children) {
      const childRoute = this.genTreeRoute(graphMap, c.name);
      some.push(...childRoute);
    }
    return [thisName, ...some, thisName];
  }
  static mapChildren(graphMap, g, name) {
    const thisMapNode = graphMap.get(name);
    if (thisMapNode.visited) {
      return;
    }
    thisMapNode.visited = true;
    for (const childrenName of g[name]) {
      const childMapNode = graphMap.get(childrenName);
      if (!childMapNode.visited) {
        thisMapNode.setChildren(childMapNode);
      }
      Tree.mapChildren(graphMap, g, childrenName);
    }
  }

  static fromGraph(graph, initLoc) {
    const g = graph.graph;
    const graphMap = new Map();
    for (const name in g) {
      graphMap.set(name, new Node(name));
    }
    const rndIdx = Math.floor(Math.random() * Object.keys(g).length);

    const initialLocation = initLoc || Object.keys(g)[rndIdx];
    Tree.mapChildren(graphMap, g, initialLocation);
    const route = Tree.genTreeRoute(graphMap, initialLocation);

    return new Tree(graphMap, route, initialLocation);
  }
}

const tree = Tree.fromGraph(graph0);
const startLocationName = tree.initalLocation;
const robo = new Robot([], tree.route, tree.initalLocation, graph0);
robo.move();
robo.viewStates("parcelsDeliveredHere", "parcelsUndelivered");
