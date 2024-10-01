import { LLMOptions, ModelProvider } from "../../index.js";
import OpenAI from "./OpenAI.js";

class Cortex extends OpenAI {
  static providerName: ModelProvider = "cortex";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "https://fb0hb1aid6.execute-api.us-east-1.amazonaws.com/prod",
  };

  protected override _getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "api-key": this.apiKey ?? "", // For Azure
      "x-api-key": "z8MuPSf4Jf8CzSPJvUstE4dab4PRUHzB98I3CapH"
    };
  }

  private static modelConversion: { [key: string]: string } = {
    "cortex-tab2": "accounts/fireworks/models/starcoder-16b",
    "cortex-tab": "accounts/fireworks/models/starcoder-7b"
  };
  protected _convertModelName(model: string): string {
    return Cortex.modelConversion[model] ?? model;
  }
}

export default Cortex;
