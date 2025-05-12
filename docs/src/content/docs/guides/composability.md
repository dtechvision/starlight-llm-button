---
title: Using with Other Plugins (Composability)
description: How to use starlight-llm-button with other Starlight plugins that modify the same components.
---

Some Starlight plugins modify the user interface by overriding default Starlight components. `starlight-llm-button` overrides the `TableOfContents` component to add the copy button.

If you use another plugin that *also* overrides `TableOfContents` (like `starlight-cooler-credit`), the last plugin registered in your `astro.config.mjs` usually "wins", potentially hiding the features of the other plugin.

## Handling Overrides

Both `starlight-llm-button` and `starlight-cooler-credit` are designed to detect this conflict. If you have both installed and enabled, you'll see warnings in your console similar to this during startup:

```log
[starlight-llm-button] It looks like you already have a `TableOfContents` component override...
[starlight-cooler-credit] It looks like you already have a `TableOfContents` component override...
```

These warnings indicate that the plugins won't automatically override the component to avoid conflict. To use features from both plugins, you need to create a custom component that manually combines them.

## Creating a Custom `TableOfContents`

1.  **Create a new component file:** Create a file, for example, at `src/components/CustomTableOfContents.astro`.

2.  **Combine the components:** Import the default Starlight `TableOfContents`, your `LLMButton`, and the desired component from the other plugin (e.g., `DefaultBottomTableOfContentsWrapper` from `starlight-cooler-credit`). Arrange them as needed:

    ```astro title="src/components/CustomTableOfContents.astro"
    ---
    import DefaultTableOfContents from '@astrojs/starlight/components/TableOfContents.astro';
    import LLMButton from 'starlight-llm-button/components/LLMButton.astro';
    import DefaultBottomTableOfContentsWrapper from 'starlight-cooler-credit/components/DefaultBottomTableOfContentsWrapper.astro';
    ---

    <!-- Render the LLM Button at the top -->
    <LLMButton />

    <!-- Render the default Starlight Table of Contents -->
    <DefaultTableOfContents>
      <slot />
    </DefaultTableOfContents>

    <!-- Render the Cooler Credit wrapper component at the bottom -->
    <DefaultBottomTableOfContentsWrapper />
    ```

3.  **Update `astro.config.mjs`:** Tell Starlight to use your new custom component instead of the default one. Make sure both plugins are still registered.

    ```js title="astro.config.mjs"
    import { defineConfig } from 'astro/config';
    import starlight from '@astrojs/starlight';
    import starlightLLMButton from 'starlight-llm-button';
    import starlightCoolerCredit from 'starlight-cooler-credit';

    export default defineConfig({
      integrations: [
        starlight({
          title: 'My Docs',
          plugins: [
            // Register both plugins
            starlightLLMButton({ /* options */ }),
            starlightCoolerCredit({ /* options */ }),
          ],
          components: {
            // Point to your custom component
            TableOfContents: '@/components/CustomTableOfContents.astro',
            // in case @ does not work as path use 
            // TableOfContents: './src/components/CustomTableOfContents.astro',
            // or register @ in your tsconfig
          },
          // ... other config
        }),
      ],
    });
    ```

Now, your site will render the `TableOfContents` with the features from both `starlight-llm-button` and `starlight-cooler-credit` integrated. 