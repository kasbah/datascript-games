import d from "datascript";

const schema = {
  ident: { ":db/unique": ":db.unique/identity" },
  init: { ":db/valueType": ":db.type/ref" },
};

let db = d.db_with(d.empty_db(schema), [
  { role: "xplayer" },
  { role: "oplayer" },
  { init: { cell: [1, 1, "b"] } },
  { init: { cell: [1, 2, "b"] } },
  { init: { cell: [1, 3, "b"] } },
  { init: { cell: [2, 1, "b"] } },
  { init: { cell: [2, 2, "b"] } },
  { init: { cell: [2, 3, "b"] } },
  { init: { cell: [3, 1, "b"] } },
  { init: { cell: [3, 2, "b"] } },
  { init: { cell: [3, 3, "b"] } },
  { init: { ident: "control", control: "xplayer" } },
]);

//const rules = `[
//  [(next ?control) [_ "init" ?init_control] [?init_control "control" "xplayer"] [?control "control" "oplayer"]]]
//]`;
const rules = `[
  [(next ?x) [_ "init" ?init] [?init "control" "xplayer"] (true ?x "oplayer")]
]`;

const init = d.q(`[:find ?init :in $ % :where [_ "init" ?init]]`, db, rules);

//console.log(JSON.stringify(init));

const control = d.q(
  `[:find ?control :in $ % :where (next ?control) ]`,
  db,
  rules,
);

console.log(JSON.stringify(control));
