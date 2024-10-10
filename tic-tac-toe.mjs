import d from "datascript";

const schema = {
  name: { ":db/unique": ":db.unique/value" },
  ident: { ":db/unique": ":db.unique/identity" },
  control: {
    ":db/cardinality": ":db.cardinality/one",
  },
};

let db = d.db_with(d.empty_db(schema), [
  { control: "xplayer" },
  { control: "oplayer" },
  {
    ident: "current",
    control: "xplayer",
  },
]);

const rules = `[
  [(next ?x) [?current "ident" "current"] [?current "control" "xplayer"] [?x "control" "oplayer"]]
  [(next ?x) [?current "ident" "current"] [?current "control" "oplayer"] [?x "control" "xplayer"]]
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
    arr.push(i.value);
    i = entries.next();
  }
  return Object.fromEntries(arr);
}
