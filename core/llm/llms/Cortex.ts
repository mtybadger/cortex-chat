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
      "x-api-key": "uMrxtqG5jk9dBqPBPk8Vn2r2TSuBV84J9pcNMoJa"
    };
  }

  supportsFim(): boolean {
    return true
  }
  
  private static modelConversion: { [key: string]: string } = {
    "cortex-tab": "codestral-latest"
  };
  protected _convertModelName(model: string): string {
    return Cortex.modelConversion[model] ?? model;
  }
}

export default Cortex;
