import d from "datascript";

let db = d.db_with(d.empty_db(), [
  { ":suit/name": "diamonds", ":suit/value": 1 },
  { ":suit/name": "hearts", ":suit/value": 2 },
  { ":suit/name": "spades", ":suit/value": 3 },
  { ":suit/name": "clubs", ":suit/value": 4 },

  { ":pip/name": "one", ":pip/value": 1 },
  { ":pip/name": "two", ":pip/value": 2 },
  { ":pip/name": "three", ":pip/value": 3 },
  { ":pip/name": "four", ":pip/value": 4 },
  { ":pip/name": "five", ":pip/value": 5 },
  { ":pip/name": "six", ":pip/value": 6 },
  { ":pip/name": "seven", ":pip/value": 7 },
  { ":pip/name": "eight", ":pip/value": 8 },
  { ":pip/name": "nine", ":pip/value": 9 },
  { ":pip/name": "ten", ":pip/value": 10 },
  { ":pip/name": "jack", ":pip/value": 11 },
  { ":pip/name": "queen", ":pip/value": 12 },
  { ":pip/name": "king", ":pip/value": 13 },
  { ":pip/name": "ace", ":pip/value": 14 },
]);

const rules = `[
  [(card ?pip ?suit) [?pip ":pip/name"] [?suit ":suit/name"]]
]`;

let result = d.q(
  `[:find ?pn :where [?pip ":pip/value" 1] [?pip ":pip/name" ?pn] :in $ % :where (card ?pip ?suit)]`,
  db,
  rules,
);

console.log(result);

//var people_db = d.db_with(d.empty_db({ age: { ":db/index": true } }), [
//  { ":db/id": 1, name: "Ivan", age: 15 },
//  { ":db/id": 2, name: "Petr", age: 37 },
//  { ":db/id": 3, name: "Ivan", age: 37 },
//]);
//
//console.log(
//  d.q(
//    `[:find ?pip ?suit
//        :in    $ %
//        :where (card ?pip ?suit)]`,
//    db,
//    `[[(card ?pip ?suit)
//       [?pip ":pip/name" ?pn]
//       [?suit ":suit/name" ?sn]]]`
//  ),
//);
