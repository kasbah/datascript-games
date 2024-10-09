import d from "datascript";

const schema = {
  ident: { ":db/unique": ":db.unique/identity" },
  facts: {
    ":db/valueType": ":db.type/ref",
    ":db/cardinality": ":db.cardinality/many",
  },
};

let db = d.db_with(d.empty_db(schema), [
  { control: "oplayer" },
  { control: "xplayer" },

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

  { ident: "init", facts: { cell: [1, 1, "b"] } },
  { ident: "init", facts: { cell: [1, 2, "b"] } },
  { ident: "init", facts: { cell: [1, 3, "b"] } },
  { ident: "init", facts: { cell: [2, 1, "b"] } },
  { ident: "init", facts: { cell: [2, 2, "b"] } },
  { ident: "init", facts: { cell: [2, 3, "b"] } },
  { ident: "init", facts: { cell: [3, 1, "b"] } },
  { ident: "init", facts: { cell: [3, 2, "b"] } },
  { ident: "init", facts: { cell: [3, 3, "b"] } },
  { ident: "init", facts: { control: "xplayer" } },

  { ident: "current" },

  //{ ident: "current", facts: { cell: [1, 1, "x"] } },
  //{ ident: "current", facts: { cell: [1, 2, "x"] } },
]);

const rules = `[
  [(next ?x) [?current "ident" "current"] [(missing? $ ?current "facts")] [?init "ident" "init"] [?init "facts" ?x]]
  [(next ?x) [_ "current" ?current] [?current "control" "xplayer"] [?x "control" "oplayer"]]
]`;

const current = d.q(
  `[:find ?facts :in $ % :where [?current "ident" "current"] [?current "facts" ?facts]]`,
  db,
  rules,
);

console.log(JSON.stringify(current));

const next = d.q(`[:find ?control :in $ % :where (next ?control) ]`, db, rules);

console.log(JSON.stringify(next));
