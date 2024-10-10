import d from "datascript";

const schema = {
  ident: { ":db/unique": ":db.unique/identity" },
  fact: {
    ":db/valueType": ":db.type/ref",
    ":db/cardinality": ":db.cardinality/many",
  },
};

let db = d.db_with(d.empty_db(schema), [
  { ident: "control", control: "xplayer" },
  { ident: "control", control: "oplayer" },

  { cell: [1, 1, "b"] },
  { cell: [1, 2, "b"] },
  { cell: [1, 3, "b"] },
  { cell: [2, 1, "b"] },
  { cell: [2, 2, "b"] },
  { cell: [2, 3, "b"] },
  { cell: [3, 1, "b"] },
  { cell: [3, 2, "b"] },
  { cell: [3, 3, "b"] },

  { cell: [1, 1, "x"] },
  { cell: [1, 2, "x"] },
  { cell: [1, 3, "x"] },
  { cell: [2, 1, "x"] },
  { cell: [2, 2, "x"] },
  { cell: [2, 3, "x"] },
  { cell: [3, 1, "x"] },
  { cell: [3, 2, "x"] },
  { cell: [3, 3, "x"] },

  { cell: [1, 1, "o"] },
  { cell: [1, 2, "o"] },
  { cell: [1, 3, "o"] },
  { cell: [2, 1, "o"] },
  { cell: [2, 2, "o"] },
  { cell: [2, 3, "o"] },
  { cell: [3, 1, "o"] },
  { cell: [3, 2, "o"] },
  { cell: [3, 3, "o"] },

  { ident: "init", fact: { cell: [1, 1, "b"] } },
  { ident: "init", fact: { cell: [1, 2, "b"] } },
  { ident: "init", fact: { cell: [1, 3, "b"] } },
  { ident: "init", fact: { cell: [2, 1, "b"] } },
  { ident: "init", fact: { cell: [2, 2, "b"] } },
  { ident: "init", fact: { cell: [2, 3, "b"] } },
  { ident: "init", fact: { cell: [3, 1, "b"] } },
  { ident: "init", fact: { cell: [3, 2, "b"] } },
  { ident: "init", fact: { cell: [3, 3, "b"] } },
  { ident: "init", fact: { control: "xplayer" } },

  { ident: "current" },
]);

const rules = `[
  [(current-fact ?fact) [?current "ident" "current"] [?current "fact" ?fact]]
  [(next ?x) [?current "ident" "current"] [(missing? $ ?current "fact")] [?init "ident" "init"] [?init "fact" ?x]]

  [(next ?x) (current-fact ?fact) [?fact "control" "xplayer"] [?x "control" "oplayer"]]
  [(next ?x) (current-fact ?fact) [?fact "control" "oplayer"] [?x "control" "xplayer"]]
]`;

function logControl(db) {
  const control = d.q(
    `[:find ?control :in $ % :where (current-fact ?fact) [?fact "control" ?control]]`,
    db,
    rules,
  );
  console.log({ control });
}

function step(db) {
  const next = d.q(`[:find ?next :in $ % :where (next ?next) ]`, db, rules);
  console.log({ next });

  const facts = d.q(
    `[:find ?fact :in $ % :where (current-fact ?fact)]`,
    db,
    rules,
  );
  console.log({ facts });
  const [[current]] = d.q(
    `[:find ?current :in $ % :where [?current "ident" "current"]]`,
    db,
    rules,
  );
  console.log({ current });

  db = d.db_with(
    db,
    facts.map(([id]) => [":db/retract", current, "fact", id]),
  );

  return d.db_with(
    db,
    next.map(([id]) => ({ ident: "current", fact: id })),
  );
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
