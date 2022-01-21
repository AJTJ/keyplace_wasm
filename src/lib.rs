mod utils;
use std::future::Future;

use js_sys::Promise;
use keyplace::{AgentKey, CustodialAgentKey, PassKey};
use serde::{Deserialize, Serialize};
use serde_json::json;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;

#[derive(Serialize, Deserialize)]
struct NewKey {
    custodial_key: CustodialAgentKey,
    agent_key: AgentKey,
}

#[derive(Serialize, Deserialize)]
struct AgentKeyStruct {
    agent_key: AgentKey,
}

#[derive(Serialize, Deserialize)]
struct CustodialKeyStruct {
    custodial_key: CustodialAgentKey,
}

// for creating a new agentkey with its custodial key
#[wasm_bindgen]
pub fn get_all_keys(email: &str, pw: &str) -> Promise {
    utils::set_panic_hook();
    let agentkey = AgentKey::create(Some(email.to_string()));
    let passkey = PassKey::new(pw);
    let custkey = NewKey {
        custodial_key: agentkey.custodial_key(passkey),
        agent_key: agentkey,
    };
    future_to_promise(async move { Ok(JsValue::from(json!(custkey).to_string())) })
}

// for deriving agent key from the custodial key sent from the server
#[wasm_bindgen]
pub fn get_agent_key(custkey_input: &str, pw: &str) -> Promise {
    utils::set_panic_hook();
    let custkey: CustodialKeyStruct =
        serde_json::from_str(custkey_input).expect_throw("incorrect custodial key input");
    let passkey = PassKey::new(pw);
    let agentkey = AgentKeyStruct {
        agent_key: AgentKey::from_custodial_key(custkey.custodial_key, passkey).unwrap(),
    };

    future_to_promise(async move { Ok(JsValue::from(json!(agentkey).to_string())) })
}
