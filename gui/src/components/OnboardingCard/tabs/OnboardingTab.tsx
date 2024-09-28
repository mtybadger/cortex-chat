import React, { useState } from 'react';
import { getLocalStorage, setLocalStorage } from "../../../util/localStorage";
import openai from "openai";
import { useOnboardingCard } from "../hooks/useOnboardingCard";
import { models } from "../../../pages/AddNewModel/configs/models";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setDefaultModel } from "../../../redux/slices/stateSlice";
import { IdeMessengerContext } from "../../../context/IdeMessenger";
import { DEFAULT_CHAT_MODEL_CONFIG } from "core/config/default";
import { providers } from "../../../pages/AddNewModel/configs/providers";

const { openai: chatProvider, mistral: autocompleteProvider } = providers;
const { gpt4o: chatModel, codestral: autocompleteModel } = models;


function OnboardingQuickstartTab() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const { close } = useOnboardingCard();

  const ideMessenger = useContext(IdeMessengerContext);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const chatModelConfig = {
      model: chatModel.params.model,
      provider: chatProvider.provider,
      apiKey: apiKey,
      title: chatModel.params.title,
    };

    const autocompleteModelConfig = {
      title: autocompleteModel.params.title,
      provider: autocompleteProvider.provider,
      model: autocompleteModel.params.model,
      apiKey: "73B3zbNPydakwBP1sQLawoENVl1WOq9T",
    };

    try {
      const openaiInstance = new openai({ apiKey, dangerouslyAllowBrowser: true });
      const completion = await openaiInstance.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say this is a test!" },
        ],
      });

      ideMessenger.post("config/deleteModel", {
        title: DEFAULT_CHAT_MODEL_CONFIG.title,
      });
      ideMessenger.post("config/deleteModel", {
        title: "Claude 3.5 Sonnet",
      });
      ideMessenger.post("config/addModel", { model: chatModelConfig });
      dispatch(setDefaultModel({ title: chatModelConfig.title, force: true }));
  
      await ideMessenger.request("addAutocompleteModel", {
        model: autocompleteModelConfig,
      });

      setLocalStorage('onboardingStatus', 'Completed');
      close(); // Dismiss the onboarding card after completion

    } catch (err) {
      setError('Invalid API key + ' + err.message + "   " + apiKey + '. Please try again.');
      console.error('Error verifying API key:', err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-3/4 text-center">
        <p className="text-sm mb-4">
          To use Cortex's AI features, you'll need to provide an OpenAI API key. If you don't have one, you can get one on the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI website</a>.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm mb-4">
          <div className="flex items-center">
            <input 
              className="appearance-none bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)] rounded-sm border-none w-full mr-3 h-7 leading-tight px-4 focus:outline-none" 
              type="text" 
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button 
              className="flex-shrink-0 bg-[var(--vscode-button-background)] text-sm border-none text-[var(--vscode-button-foreground)] h-7 px-3 rounded-sm" 
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default OnboardingQuickstartTab;
