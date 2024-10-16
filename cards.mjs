import d from "datascript";

const schema = { ident: { ":db/unique": ":db.unique/identity" } };

let db = d.db_with(d.empty_db(schema), [
  { "suit/name": "diamonds", "suit/value": 1 },
  { "suit/name": "hearts", "suit/value": 2 },
  { "suit/name": "spades", "suit/value": 3 },
  { "suit/name": "clubs", "suit/value": 4 },

  { "pip/name": "one", "pip/value": 1 },
  { "pip/name": "two", "pip/value": 2 },
  { "pip/name": "three", "pip/value": 3 },
  { "pip/name": "four", "pip/value": 4 },
  { "pip/name": "five", "pip/value": 5 },
  { "pip/name": "six", "pip/value": 6 },
  { "pip/name": "seven", "pip/value": 7 },
  { "pip/name": "eight", "pip/value": 8 },
  { "pip/name": "nine", "pip/value": 9 },
  { "pip/name": "ten", "pip/value": 10 },
  { "pip/name": "jack", "pip/value": 11 },
  { "pip/name": "queen", "pip/value": 12 },
  { "pip/name": "king", "pip/value": 13 },
  { "pip/name": "ace", "pip/value": 14 },

  { "player/name": "player1", "player/hand": [] },
  { "player/name": "player2", "player/hand": [] },
  { stages: ["initial", "playing", "finished"] },
  { ident: "game_state", stage: "initial" },
]);

const rules = `[
  [(card ?pip_name ?suit_name ?pip ?suit) [?pip "pip/name" ?pip_name] [?suit "suit/name" ?suit_name]]
  [(beats ?pip_name1 ?suit_name1 ?pip_name2 ?suit_name2)
    (card ?pip_name1 ?suit_name1 ?pip1 ?suit1)
    (card ?pip_name2 ?suit_name2 ?pip2 ?suit2)
    [?pip1 "pip/value" ?pip_value1]
    [?pip2 "pip/value" ?pip_value2]
    [?suit1 "suit/value" ?suit_value1]
    [?suit2 "suit/value" ?suit_value2]
    (or
      [(> ?pip_value1 ?pip_value2)]
      (and [(= ?pip_value1 ?pip_value2)] [(> ?suit_value1 ?suit_value2)])
    )
  ]
]`;

//let result = d.q(
//  `[:find ?pip_name ?suit_name :in $ % :where (beats ?pip_name ?suit_name "queen" "hearts")]`,
//  db,
//  rules,
//);
let result = d.q(`[:find ?stage :in $ % :where [_ "stage" ?stage]]`, db, rules);

console.log(result);

//const conn = d.create_conn(db, schema);

const game_step = (db) => {
  const stage = d.q(
    `[:find ?stage :in $ % :where [?game_state "ident" "game_state"] [?game_state "stage" ?stage]]`,
    db,
    rules,
  )[0][0];
  const stages = d.q(
    `[:find ?stages :in $ % :where [_ "stages" ?stages]]`,
    db,
    rules,
  )[0][0];
  const next_stage_index = stages.indexOf(stage) + 1;
  if (next_stage_index >= stages.length) {
    return [];
  }
  const next_stage = stages[next_stage_index];
  return [{ ident: "game_state", stage: next_stage }];
};

db = d.db_with(db, [[":db.fn/call", game_step]]);

result = d.q(`[:find ?stage :in $ % :where [_ "stage" ?stage]]`, db, rules);

console.log(result);

db = d.db_with(db, [[":db.fn/call", game_step]]);

result = d.q(`[:find ?stage :in $ % :where [_ "stage" ?stage]]`, db, rules);

console.log(result);

db = d.db_with(db, [[":db.fn/call", game_step]]);

result = d.q(`[:find ?stage :in $ % :where [_ "stage" ?stage]]`, db, rules);

console.log(result);
