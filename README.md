### An implementation of keyplace (https://github.com/mindbeam/keyplace) wrapped in wasm-pack

### Example Usage
```js
import init, { get_all_keys, get_agent_key } from "./pkg/keyplace_wasm.js";
const runWasm = async () => {
  const pw = "dank memes";
  const email = "yes@yes.com";

  await init();
  const allKeysResult = get_all_keys(email, pw);
  const allKeysJson = JSON.parse(allKeysResult);

  console.log("WEB - get_all_keys result", allKeysJson.agent_key.keypair);

  const custKey = allKeysJson.custodial_key;

  const agentKeyResult = get_agent_key(JSON.stringify(custKey), pw);
  const agentKeyJson = JSON.parse(agentKeyResult);

  console.log("WEB - get_agent_key result", agentKeyJson.agent_key.keypair);
};
runWasm();
```

