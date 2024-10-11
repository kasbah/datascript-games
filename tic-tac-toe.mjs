import d from "datascript";

const schema = {
  ident: { ":db/unique": ":db.unique/identity" },
  control: {
    ":db/cardinality": ":db.cardinality/one",
  },
  "0,0": { ":db/cardinality": ":db.cardinality/one" },
  "0,1": { ":db/cardinality": ":db.cardinality/one" },
  "0,2": { ":db/cardinality": ":db.cardinality/one" },
  "1,0": { ":db/cardinality": ":db.cardinality/one" },
  "1,2": { ":db/cardinality": ":db.cardinality/one" },
  "2,0": { ":db/cardinality": ":db.cardinality/one" },
  "2,1": { ":db/cardinality": ":db.cardinality/one" },
  "2,2": { ":db/cardinality": ":db.cardinality/one" },
};

let db = d.db_with(d.empty_db(schema), [
  { control: "player-x" },
  { control: "player-o" },

  { type: "cell", "0,0": "blank" },
  { type: "cell", "0,1": "blank" },
  { type: "cell", "0,2": "blank" },
  { type: "cell", "1,0": "blank" },
  { type: "cell", "1,1": "blank" },
  { type: "cell", "1,2": "blank" },
  { type: "cell", "2,0": "blank" },
  { type: "cell", "2,1": "blank" },
  { type: "cell", "2,2": "blank" },

  { type: "cell", "0,0": "x" },
  { type: "cell", "0,1": "x" },
  { type: "cell", "0,2": "x" },
  { type: "cell", "1,0": "x" },
  { type: "cell", "1,1": "x" },
  { type: "cell", "1,2": "x" },
  { type: "cell", "2,0": "x" },
  { type: "cell", "2,1": "x" },
  { type: "cell", "2,2": "x" },

  { type: "cell", "0,0": "o" },
  { type: "cell", "0,1": "o" },
  { type: "cell", "0,2": "o" },
  { type: "cell", "1,0": "o" },
  { type: "cell", "1,1": "o" },
  { type: "cell", "1,2": "o" },
  { type: "cell", "2,0": "o" },
  { type: "cell", "2,1": "o" },
  { type: "cell", "2,2": "o" },

  { type: "coord", m: 0, n: 0, name: "0,0" },
  { type: "coord", m: 0, n: 1, name: "0,1" },
  { type: "coord", m: 0, n: 2, name: "0,2" },
  { type: "coord", m: 1, n: 0, name: "1,0" },
  { type: "coord", m: 1, n: 1, name: "1,1" },
  { type: "coord", m: 1, n: 2, name: "1,2" },
  { type: "coord", m: 2, n: 0, name: "2,0" },
  { type: "coord", m: 2, n: 1, name: "2,1" },
  { type: "coord", m: 2, n: 2, name: "2,2" },

  {
    ident: "current",
    control: "player-x",
    "0,0": "blank",
    "0,1": "blank",
    "0,2": "blank",
    "1,0": "blank",
    "1,1": "blank",
    "1,2": "blank",
    "2,0": "blank",
    "2,1": "blank",
    "2,2": "blank",
  },
]);

const rules = `[
  [(next ?x) [?current "ident" "current"] [?current "control" "player-x"] [?x "control" "player-o"]]
  [(next ?x) [?current "ident" "current"] [?current "control" "player-o"] [?x "control" "player-x"]]
  [(legal ?x) [?current "ident" "current"] [?current "control" "player-x"] [?x "type" "cell"] [?x ?key "x"] [?current ?key "blank"]]
  [(legal ?x) [?current "ident" "current"] [?current "control" "player-o"] [?x "type" "cell"] [?x ?key "o"] [?current ?key "blank"]]
  [(row ?m ?x) 
    [?current "ident" "current"] 
    [?coord0 "type" "coord"] 
    [?coord1 "type" "coord"] 
    [?coord2 "type" "coord"]
    [?coord0 "n" 0] 
    [?coord1 "n" 1] 
    [?coord2 "n" 2] 
    [?coord0 "m" ?m] 
    [?coord1 "m" ?m] 
    [?coord2 "m" ?m] 
    [?coord0 "name" ?key0] [?current ?key0 ?x]
    [?coord1 "name" ?key1] [?current ?key1 ?x]
    [?coord2 "name" ?key2] [?current ?key2 ?x]
  ]
  [(column ?n ?x) 
    [?current "ident" "current"] 
    [?coord0 "type" "coord"] 
    [?coord1 "type" "coord"] 
    [?coord2 "type" "coord"]
    [?coord0 "m" 0] 
    [?coord1 "m" 1] 
    [?coord2 "m" 2] 
    [?coord0 "n" ?n] 
    [?coord1 "n" ?n] 
    [?coord2 "n" ?n] 
    [?coord0 "name" ?key0] [?current ?key0 ?x]
    [?coord1 "name" ?key1] [?current ?key1 ?x]
    [?coord2 "name" ?key2] [?current ?key2 ?x]
  ]
  [(diagonal ?x)
    [?current "ident" "current"]
    [?coord0 "type" "coord"]
    [?coord1 "type" "coord"]
    [?coord2 "type" "coord"]
    [?coord0 "m" 0] 
    [?coord1 "m" 1] 
    [?coord2 "m" 2] 
    [?coord0 "n" 0] 
    [?coord1 "n" 1] 
    [?coord2 "n" 2] 
    [?coord0 "name" ?key0] [?current ?key0 ?x]
    [?coord1 "name" ?key1] [?current ?key1 ?x]
    [?coord2 "name" ?key2] [?current ?key2 ?x]
  ]
  [(diagonal ?x)
    [?current "ident" "current"]
    [?coord0 "type" "coord"]
    [?coord1 "type" "coord"]
    [?coord2 "type" "coord"]
    [?coord0 "m" 0] 
    [?coord1 "m" 1] 
    [?coord2 "m" 2] 
    [?coord0 "n" 2] 
    [?coord1 "n" 1] 
    [?coord2 "n" 0] 
    [?coord0 "name" ?key0] [?current ?key0 ?x]
    [?coord1 "name" ?key1] [?current ?key1 ?x]
    [?coord2 "name" ?key2] [?current ?key2 ?x]
  ]
  [(line ?x) (or (row 0 ?x) (column 0 ?x) (row 1 ?x) (column 1 ?x) (row 2 ?x) (column 2 ?x) (diagonal ?x))]
  [(winner ?x) (line ?x) [(!= ?x "blank")]]
]`;

function findWinner(db) {
  return d.q(`[:find ?x :in $ % :where (winner ?x)]`, db, rules)[0]?.[0];
}

function makeMove(db) {
  const legal = d.q(`[:find ?legal :in $ % :where (legal ?legal)]`, db, rules);
  const moveId = legal[Math.floor(Math.random() * legal.length)][0];
  const move = toObj(d.entity(db, moveId));
  db = d.db_with(db, [{ ...move, ident: "current" }]);
  return db;
}

function step(db) {
  const next = d.q(`[:find ?next :in $ % :where (next ?next)]`, db, rules);
  db = d.db_with(
    db,
    next.map(([id]) => {
      const entity = toObj(d.entity(db, id));
      return { ...entity, ident: "current" };
    }),
  );
  return db;
}

let winner;
while (!winner) {
  db = makeMove(db);
  db = step(db);
  logBoard(db);
  winner = findWinner(db);
}

console.log({ winner });

function toObj(entity) {
  const entries = entity.entries();
  const arr = [];
  let i = entries.next();
  while (!i.done) {
    if (i.value[0] !== "type") {
      arr.push(i.value);
    }
    i = entries.next();
  }
  return Object.fromEntries(arr);
}

function logBoard(db) {
  const coords = d.q(
    `[:find ?m ?n ?x :in $ % :where 
      [?current "ident" "current"] 
      [?coord "type" "coord"] 
      [?coord "name" ?key] 
      [?coord "m" ?m]
      [?coord "n" ?n] 
      [?current ?key ?x]]`,
    db,
    rules,
  );

  const board = coords.reduce((acc, [m, n, x]) => {
    if (x === "blank") {
      x = " ";
    }
    if (!acc[m]) {
      acc[m] = [];
    }
    acc[m][n] = x;
    return acc;
  }, []);
  console.log("-----");
  for (const row of board) {
    console.log(row.join(" "));
  }
  console.log("-----");
}
