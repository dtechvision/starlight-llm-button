import type { AstroIntegration } from "astro";
import type { StarlightPlugin } from "@astrojs/starlight/types";
import { Translations } from "./translations";
import { vitePluginStarlightLLMButtonConfig } from "./libs/vite"; // Import the new Vite plugin

const TABLE_OF_CONTENTS_OVERRIDE = "starlight-llm-button/overrides/TableOfContents.astro";

export interface StarlightLLMButtonOptions {
  contentCollection?: string; // default: 'docs'
  customText?: {
    copy?: string;
    copied?: string;
    error?: string;
  };
  styleOverride?: string; // if set, use this CSS string for the button style
}

export default function starlightLLMButtonPlugin(options: StarlightLLMButtonOptions = {}): StarlightPlugin {
  const {
    contentCollection = 'docs',
    customText = {},
    styleOverride,
  } = options;

  return {
    name: "starlight-llm-button",
    hooks: {
      'i18n:setup'({ injectTranslations }: { injectTranslations: (translations: Record<string, Record<string, string>>) => void }) {
        injectTranslations(Translations);
      },
      'config:setup'({ updateConfig, config, addIntegration }: {
        updateConfig: (newConfig: Record<string, unknown>) => void;
        config: unknown;
        addIntegration: (integration: AstroIntegration) => void;
      }) {
        const llmButtonOptions: StarlightLLMButtonOptions = {
          contentCollection,
          customText,
          ...(styleOverride !== undefined && { styleOverride }),
        };

        addIntegration({
          name: 'starlight-llm-button-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig: updateAstroConfig }: { updateConfig: (config: Record<string, unknown>) => void }) => {
              updateAstroConfig({
                vite: {
                  plugins: [vitePluginStarlightLLMButtonConfig(llmButtonOptions)],
                },
              });
            },
          },
        });

        const components = (config as { components?: Record<string, unknown> }).components ?? {};
        updateConfig({
          components: {
            ...components,
            TableOfContents: TABLE_OF_CONTENTS_OVERRIDE,
          },
        });
      },
    },
  };
}
