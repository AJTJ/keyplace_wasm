// // FOR TARGET WEB WITH SERVER
import init, { get_all_keys, get_agent_key } from "./pkg/keyplace_wasm.js";
const runWasm = async () => {
  // Create an ECC keypair
  const pw = "dank memes";
  const email = "yes@yes.com";

  await init();
  const allKeysResult = get_all_keys(email, pw);
  const allKeysJson = JSON.parse(allKeysResult);

  console.log("WEB - get_all_keys result", allKeysJson.agent_key.keypair);

  // save the custodial key to the server
  let save_data = {
    email,
    custodial_key: allKeysJson.custodial_key,
  };

  let saveKeyResponse = await fetch("http://127.0.0.1:8080/save_key", {
    method: "POST",
    body: JSON.stringify(save_data),
  });

  // recover the agent key via the custodial key from the server
  let getKeyResponse = await fetch("http://127.0.0.1:8080/get_key", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  let getKeyJson = await getKeyResponse.json();
  let custKey = getKeyJson.custodial_key;

  const agentKeyResult = get_agent_key(JSON.stringify(custKey), pw);
  const agentKeyJson = JSON.parse(agentKeyResult);

  console.log("WEB - get_agent_key result", agentKeyJson.agent_key.keypair);
};
runWasm();

// WITH LOCAL PACKAGE
// FOR TARGET WEB
// import init, { get_all_keys, get_agent_key } from "./pkg/keyplace_wasm.js";
// const runWasm = async () => {
//   const pw = "dank memes";
//   const email = "yes@yes.com";

//   await init();
//   const allKeysResult = get_all_keys(email, pw);
//   const allKeysJson = JSON.parse(allKeysResult);

//   console.log("WEB - get_all_keys result", allKeysJson.agent_key.keypair);

//   const custKey = allKeysJson.custodial_key;

//   const agentKeyResult = get_agent_key(JSON.stringify(custKey), pw);
//   const agentKeyJson = JSON.parse(agentKeyResult);

//   console.log("WEB - get_agent_key result", agentKeyJson.agent_key.keypair);
// };
// runWasm();

// OUTDATED
// FOR TARGET NODE
// const { get_custodial_key, get_agent_key } = require("./pkg/keyplace_wasm");
// const pw = "dank memes";
// const email = "yes@yes.com";
// const matchResult = get_custodial_key(email, pw);
// let result_json = JSON.parse(matchResult);
// console.log("Node - custodial key and agent key", result_json);

// // need to await matchResult somehow
// let custKey = {
//   custodial_key: matchResult.custodial_key,
// };

// const agentKey = get_agent_key(JSON.stringify(custKey), pw);
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
//   let custKey = {
//     custodial_key: matchResult.custodial_key,
//   };

//   const agentKey = get_agent_key(JSON.stringify(custKey), pw);
//   console.log("WEB - agent key", JSON.parse(agentKey));
// });
