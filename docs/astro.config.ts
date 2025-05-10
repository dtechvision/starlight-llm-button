import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightLLMButton from "starlight-llm-button";

export default defineConfig({
  integrations: [
    starlight({
      title: {
        en: "Starlight LLM Button",
        de: "Starlight LLM Button",
      },
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
        replacesTitle: true,
      },
      editLink: {
        baseUrl:
          "https://github.com/dtechvision/starlight-cooler-credit/edit/master/docs/",
      },
      plugins: [
        starlightLinksValidator(),
        starlightLLMButton(),
      ],
      sidebar: [
        {
          label: "Start Here",
          translations: {
            de: "Loslegen",
          },
          items: [
            { slug: "getting-started" },
            { slug: "configuration" },
          ],
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/dtechvision/starlight-llm-button",
        },
      ],
    }),
  ],
});
