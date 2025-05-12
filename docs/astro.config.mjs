import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLLMButton from 'starlight-llm-button';
import starlightCoolerCredit from 'starlight-cooler-credit';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Starlight LLM Button',
      plugins: [
        starlightLLMButton({
          // Add any llm-button specific options here
        }),
        starlightCoolerCredit({
          // Add any cooler-credit specific options here
          // e.g., credit: 'Astro' 
        }),
      ],
      components: {
        TableOfContents: './src/components/CustomTableOfContents.astro',
      },
      social: [
        {
          label: 'GitHub',
          icon: 'github',
          href: 'https://github.com/dtechvision/starlight-llm-button',
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Example Guide', link: '/guides/example/' },
            { label: 'Composability Guide', link: '/guides/composability/' },
          ],
        },
      ],
    }),
  ],
}); 