import d from "datascript";

const schema = {
  ident: { ":db/unique": ":db.unique/identity" },
  control: {
    ":db/cardinality": ":db.cardinality/one",
  },
  "0,0": { "db/cardinality": ":db.cardinality/one" },
  "0,1": { "db/cardinality": ":db.cardinality/one" },
  "0,2": { "db/cardinality": ":db.cardinality/one" },
  "1,0": { "db/cardinality": ":db.cardinality/one" },
  "1,2": { "db/cardinality": ":db.cardinality/one" },
  "2,0": { "db/cardinality": ":db.cardinality/one" },
  "2,1": { "db/cardinality": ":db.cardinality/one" },
  "2,2": { "db/cardinality": ":db.cardinality/one" },
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
  [(legal ?x) [?current "ident" "current"] [?current "control" "player-o"] [?x "type" "cell"] [?x ?key "x"] [?current ?key "blank"]]
]`;

function logControl(db) {
  const control = d.q(
    `[:find ?control :in $ % :where [?current "ident" "current"] [?current "control" ?control]]`,
    db,
    rules,
  );
  console.log("control", JSON.stringify(control));
}

function step(db) {
  const legal = d.q(`[:find ?legal :in $ % :where (legal ?legal)]`, db, rules);

  const moveId = legal[Math.floor(Math.random() * legal.length)][0];
  const move = toObj(d.entity(db, moveId));
  console.log("move", move);

  db = d.db_with(db, [{ ...move, ident: "current" }]);

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

logControl(db);

console.log("----");
console.log("1");
console.log("----");
db = step(db);
logControl(db);

console.log("----");
console.log("2");
console.log("----");
db = step(db);
logControl(db);

console.log("----");
console.log("3");
console.log("----");
db = step(db);
logControl(db);

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
