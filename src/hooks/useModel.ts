import { useState, useEffect } from "react";
import { useSettingStore } from "@/store/setting";
import { shuffle } from "radash";

// Default models for different providers
const DEFAULT_MODELS = {
  google: [
    "gemini-2.0-flash-thinking-exp",
    "gemini-2.0-flash-exp",
    "gemini-2.5-pro"
  ],
  openai: [
    "gpt-4o",
    "gpt-4-turbo",
    "gpt-3.5-turbo"
  ],
  anthropic: [
    "claude-3-opus",
    "claude-3-sonnet",
    "claude-3-haiku"
  ],
  kimi: [
    "moonshot-v1-8k",
    "moonshot-v1-32k",
    "moonshot-v1-128k"
  ]
};

function useModel() {
  const [modelList, setModelList] = useState<string[]>([]);
  // Get the current provider from the store for initial setup
  const { provider } = useSettingStore();
  
  console.log("[useModel] Initialized with provider:", provider);

  // Subscribe to provider changes in the store
  useEffect(() => {
    // Initial refresh
    refresh();
    
    // Subscribe to store changes
    const unsubscribe = useSettingStore.subscribe(
      (state, prevState) => {
        if (state.provider !== prevState.provider) {
          console.log("[useModel] Provider changed in store:", state.provider);
          refresh();
        }
      }
    );
    
    return () => unsubscribe();
  }, [provider]); // Add provider to dependency array to refresh when it changes

  async function refresh(): Promise<string[]> {
    // Always get the latest provider value directly from the store
    const currentProvider = useSettingStore.getState().provider;
    console.log("[useModel] refresh() called with currentProvider:", currentProvider);
    console.log("[useModel] Direct access to useSettingStore.getState().provider:", useSettingStore.getState().provider);
    
    const {
      apiKey = "",
      apiProxy,
      accessPassword
    } = useSettingStore.getState();
    
    const apiKeys = shuffle(apiKey.split(","));

    // If no API key is provided, return default models for the selected provider
    if (!apiKey && !accessPassword) {
      const defaultModels = DEFAULT_MODELS[currentProvider as keyof typeof DEFAULT_MODELS] || [];
      console.log("[useModel] No API key, using default models for provider:", currentProvider, defaultModels);
      setModelList(defaultModels);
      return defaultModels;
    }

    // Google provider uses API to fetch available models
    if (currentProvider === "google") {
      try {
        const response = await fetch(
          apiKeys[0]
            ? `${
                apiProxy || "https://generativelanguage.googleapis.com"
              }/v1beta/models`
            : "/api/ai/google/v1beta/models",
          {
            headers: {
              "x-goog-api-key": apiKeys[0] ? apiKeys[0] : accessPassword,
            },
          }
        );
        const { models = [] } = await response.json();
        const newModelList = (models as Model[])
          .filter(
            (item) =>
              item.name.startsWith("models/gemini") &&
              item.supportedGenerationMethods.includes("generateContent")
          )
          .map((item) => item.name.replace("models/", ""));
        console.log("[useModel] Google API returned models:", newModelList);
        setModelList(newModelList);
        return newModelList;
      } catch (error) {
        console.error("Failed to fetch Google models:", error);
        const defaultModels = DEFAULT_MODELS.google || [];
        console.log("[useModel] Error fetching Google models, using defaults:", defaultModels);
        setModelList(defaultModels);
        return defaultModels;
      }
    } 
    // For OpenAI and Anthropic, use predefined models
    else {
      const defaultModels = DEFAULT_MODELS[currentProvider as keyof typeof DEFAULT_MODELS] || [];
      console.log("[useModel] Using default models for non-Google provider:", currentProvider, defaultModels);
      setModelList(defaultModels);
      return defaultModels;
    }
  }

  return {
    modelList,
    refresh,
  };
}

export default useModel;
