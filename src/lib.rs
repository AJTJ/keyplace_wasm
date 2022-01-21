mod utils;
use keyplace::{AgentKey, CustodialAgentKey, PassKey};
use serde::{Deserialize, Serialize};
use serde_json::json;
use wasm_bindgen::prelude::*;

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
pub fn get_custodial_key(email: &str, pw: &str) -> Result<String, JsValue> {
    utils::set_panic_hook();
    let agentkey = AgentKey::create(Some(email.to_string()));
    let passkey = PassKey::new(pw);
    let custkey = NewKey {
        custodial_key: agentkey.custodial_key(passkey),
        agent_key: agentkey,
    };

    Ok(json!(custkey).to_string())
    // Ok(json!("Response HERe".to_string()).to_string())
}

// for deriving agent key from the custodial key sent from the server
#[wasm_bindgen]
pub fn get_agent_key(custkey_input: &str, pw: &str) -> Result<String, JsValue> {
    utils::set_panic_hook();
    let custkey: CustodialKeyStruct =
        serde_json::from_str(custkey_input).expect_throw("incorrect custodial key input");
    let passkey = PassKey::new(pw);
    let agentkey = AgentKeyStruct {
        agent_key: AgentKey::from_custodial_key(custkey.custodial_key, passkey).unwrap(),
    };

    Ok(json!(agentkey).to_string())
}
