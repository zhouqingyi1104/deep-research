export function isThinkingModel(model: string) {
  // Google models
  if (model.startsWith("gemini")) {
    return model.includes("thinking") || model.startsWith("gemini-2.5-pro");
  }
  // OpenAI models - consider GPT-4 models as thinking models
  else if (model.startsWith("gpt-4")) {
    return true;
  }
  // Anthropic models - consider Claude Opus and Sonnet as thinking models
  else if (model.includes("claude")) {
    return model.includes("opus") || model.includes("sonnet");
  }
  // Moonshot Kimi models - all models can be used for thinking
  else if (model.startsWith("moonshot")) {
    return true;
  }
  return false;
}

export function isNetworkingModel(model: string) {
  // Google models
  if (model.startsWith("gemini")) {
    return (
      (model.startsWith("gemini-2.0-flash") &&
        !model.includes("lite") &&
        !model.includes("thinking") &&
        !model.includes("image")) ||
      model.startsWith("gemini-2.5-pro")
    );
  }
  // All OpenAI models can be used for networking
  else if (model.startsWith("gpt")) {
    return true;
  }
  // All Claude models can be used for networking
  else if (model.includes("claude")) {
    return true;
  }
  // All Moonshot Kimi models can be used for networking
  else if (model.startsWith("moonshot")) {
    return true;
  }
  return false;
}

export function filterThinkingModelList(modelList: string[]) {
  const thinkingModelList: string[] = [];
  const nonThinkingModelList: string[] = [];
  modelList.forEach((model) => {
    if (isThinkingModel(model)) {
      thinkingModelList.push(model);
    } else {
      nonThinkingModelList.push(model);
    }
  });
  return [thinkingModelList, nonThinkingModelList];
}

export function filterNetworkingModelList(modelList: string[]) {
  const networkingModelList: string[] = [];
  const nonNetworkingModelList: string[] = [];
  modelList.filter((model) => {
    if (isNetworkingModel(model)) {
      networkingModelList.push(model);
    } else {
      nonNetworkingModelList.push(model);
    }
  });
  return [networkingModelList, nonNetworkingModelList];
}
