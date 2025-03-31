import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { useSettingStore } from "@/store/setting";
import { shuffle } from "radash";

export function useModelProvider() {
  const { apiKey = "", apiProxy, accessPassword, provider = "google" } = useSettingStore();

  function createProvider(type: "google" | "openai" | "anthropic" | "kimi" | string = provider) {
    const apiKeys = shuffle(apiKey.split(","));
    const key = apiKeys[0] || accessPassword;

    if (type === "google") {
      return createGoogleGenerativeAI(
        apiKeys[0]
          ? {
              baseURL: `${
                apiProxy || "https://generativelanguage.googleapis.com"
              }/v1beta`,
              apiKey: apiKeys[0],
            }
          : {
              baseURL: "/api/ai/google/v1beta",
              apiKey: accessPassword,
            }
      );
    } else if (type === "openai") {
      return createOpenAI({
        apiKey: key,
        baseURL: apiProxy || undefined
      });
    } else if (type === "anthropic") {
      return createAnthropic({
        apiKey: key,
        baseURL: apiProxy || undefined
      });
    } else if (type === "kimi") {
      return createOpenAI({
        apiKey: key,
        baseURL: apiProxy || "https://api.moonshot.cn/v1"
      });
    } else {
      throw new Error("Unsupported Provider: " + type);
    }
  }

  return {
    createProvider,
  };
}
