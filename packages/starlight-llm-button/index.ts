import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import type { StarlightPlugin, StarlightUserConfig } from "@astrojs/starlight/types";
import { Translations } from "./translations";
import { vitePluginStarlightLLMButtonConfig } from "./libs/vite";

const TABLE_OF_CONTENTS_OVERRIDE = "starlight-llm-button/overrides/TableOfContents.astro";
const LLM_BUTTON_COMPONENT = "starlight-llm-button/components/LLMButton.astro"; 

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
      'config:setup'({ updateConfig, config, addIntegration, logger }: {
        updateConfig: (newConfig: Record<string, unknown>) => void;
        config: { components?: StarlightUserConfig['components'] } & Record<string, unknown>;
        addIntegration: (integration: AstroIntegration) => void;
        logger: AstroIntegrationLogger;
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

        const components = config.components ?? {};
        let tocOverride = {}; // Default to empty override object

        if (components.TableOfContents) {
          // Log warning if overridden
          logger.warn(
            '[starlight-llm-button] It looks like you already have a `TableOfContents` component override in your Starlight configuration.'
          );
          logger.warn(
            '[starlight-llm-button] To use `starlight-llm-button` alongside other overrides, please create a custom TableOfContents component manually.'
          );
          logger.warn(
            `[starlight-llm-button] Example: Create src/components/CustomTOC.astro and import/render both the original TOC (<Default><slot /></Default>) and the LLM button (<LLMButton /> from '''${LLM_BUTTON_COMPONENT}''') within it. Then, update your astro.config.mjs to use this custom component.`
          );
        } else {
          // Set the override only if not already set
          tocOverride = { TableOfContents: TABLE_OF_CONTENTS_OVERRIDE };
        }

        // Update config with potentially empty or actual override
        updateConfig({
          components: {
            ...components,
            ...tocOverride, 
          },
        });
      },
    },
  };
}
