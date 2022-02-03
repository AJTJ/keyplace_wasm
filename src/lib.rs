mod utils;
// use std::future::Future;

// use js_sys::Promise;
use keyplace::{AgentKey, CustodialAgentKey, PassKey};
use serde::{Deserialize, Serialize};
use serde_json::json;
use wasm_bindgen::prelude::*;
// use wasm_bindgen_futures::future_to_promise;

#[derive(Serialize, Deserialize)]
struct NewKey {
    custodial_key: CustodialAgentKey,
    agent_key: AgentKey,
}

#[derive(Serialize, Deserialize)]
struct AgentKeyStruct {
    agent_key: AgentKey,
}

// for creating a new agentkey, passkey and related custodial key
#[wasm_bindgen]
pub fn get_all_keys(email: &str, pw: &str) -> Result<String, JsValue> {
    utils::set_panic_hook();
    // create ECC keypair
    let agentkey = AgentKey::create(Some(email.to_string()));

    // create PassKey based on password
    let passkey = PassKey::new(pw);

    let allkeys = NewKey {
        // generate CustodialKey using the AgentKey and the PassKey
        custodial_key: agentkey.custodial_key(passkey),
        agent_key: agentkey,
    };
    Ok(json!(allkeys).to_string())
}

// for deriving agent key from the custodial key sent from the server and the user's pw
#[wasm_bindgen]
pub fn get_agent_key(custkey_input: &str, pw: &str) -> Result<String, JsValue> {
    utils::set_panic_hook();

    let custkey: CustodialAgentKey =
        serde_json::from_str(custkey_input).expect_throw("incorrect custodial key input");

    // generate PassKey based on password
    let passkey = PassKey::new(pw);
    let agentkey = AgentKeyStruct {
        // generate AgentKey based on CustodialKey and PassKey
        agent_key: AgentKey::from_custodial_key(custkey, passkey).unwrap(),
    };

    Ok(json!(agentkey).to_string())
}
