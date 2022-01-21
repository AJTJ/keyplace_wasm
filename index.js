// FOR TARGET WEB
// import init, { get_custodial_key } from "./pkg/keyplace_wasm.js";
// const runWasm = async () => {
//   console.log("hello");
//   await init("./pkg/keyplace_wasm_bg.wasm");

//   const matchResult = get_custodial_key("yes@yes.com", "dank memes");
//   console.log("IN WEB", { matchResult });
//   document.body.textContent = `matchResult: ${matchResult}`;
// };
// runWasm();
// FOR TARGET NODE
const { get_custodial_key, get_agent_key } = require("./pkg/keyplace_wasm");
const pw = "dank memes";
const matchResult = get_custodial_key("yes@yes.com", pw);
let result_json = JSON.parse(matchResult);
console.log("Node - custodial key and agent key", result_json);

let cust_key = {
  custodial_key: matchResult.custodial_key,
};

const agentKey = get_agent_key(JSON.stringify(cust_key), pw);
console.log("NODE - agent key", JSON.parse(agentKey));

// let cust_key = {
//   custodial_key: {
//     check: "lhVtWnd/JMlzVnSPalnjglZjOZkFc4L6oJOTgS0M0lg",
//     email: "yes@yes.com",
//     mask: { mask: "1x/GFSTKUzWa4o+VxEpd8jeWnwNCsKzjgYO21I22jmo" },
//     pubkey: "NkLnFJLZWfYyTtgI4BFXB+Qq+SgqODjy8uflpVesG6U",
//   },
// };
