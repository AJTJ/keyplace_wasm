// FOR TARGET WEB
import init, { get_all_keys, get_agent_key } from "./pkg/keyplace_wasm.js";
const runWasm = async () => {
  const pw = "dank memes";
  const email = "yes@yes.com";

  await init("./pkg/keyplace_wasm_bg.wasm");
  const allKeysResult = await get_all_keys(email, pw);
  const allKeysJson = JSON.parse(allKeysResult);

  console.log("WEB - get_all_keys result", allKeysJson.agent_key.keypair);

  let cust_key = {
    custodial_key: allKeysJson.custodial_key,
  };

  const agentKeyResult = await get_agent_key(JSON.stringify(cust_key), pw);
  const agentKeyJson = JSON.parse(agentKeyResult);

  console.log("WEB - get_agent_key result", agentKeyJson.agent_key.keypair);
};
runWasm();

// FOR TARGET NODE
// const { get_custodial_key, get_agent_key } = require("./pkg/keyplace_wasm");
// const pw = "dank memes";
// const email = "yes@yes.com";
// const matchResult = get_custodial_key(email, pw);
// let result_json = JSON.parse(matchResult);
// console.log("Node - custodial key and agent key", result_json);

// // need to await matchResult somehow
// let cust_key = {
//   custodial_key: matchResult.custodial_key,
// };

// const agentKey = get_agent_key(JSON.stringify(cust_key), pw);
// console.log("NODE - agent key", JSON.parse(agentKey));

// const loadResultPromise = () => {
//   return new Promise((resolve, reject) => {
//     get_custodial_key(email, pw, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };
// loadResultPromise().then((matchResult) => {
//   console.log("WEB - match result", { matchResult });
//   document.body.textContent = `matchResult: ${matchResult}`;
//   let cust_key = {
//     custodial_key: matchResult.custodial_key,
//   };

//   const agentKey = get_agent_key(JSON.stringify(cust_key), pw);
//   console.log("WEB - agent key", JSON.parse(agentKey));
// });
