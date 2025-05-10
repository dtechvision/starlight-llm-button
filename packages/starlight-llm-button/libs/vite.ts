import type { ViteUserConfig } from 'astro';

import type { StarlightLLMButtonOptions } from '..';

// Define the Vite plugin function that creates the virtual module
export function vitePluginStarlightLLMButtonConfig(
	options: StarlightLLMButtonOptions
): VitePlugin {
	const moduleId = 'virtual:starlight-llm-button-config';
	// Prefix with \0 to tell Vite this is a virtual module
	const resolvedModuleId = `\0${moduleId}`;
	// Generate the code for the virtual module using the passed options
	const moduleContent = `export default ${JSON.stringify(options)};`;

	return {
		name: 'vite-plugin-starlight-llm-button-config',
		// Resolve the virtual module ID
		resolveId(id) {
			return id === moduleId ? resolvedModuleId : undefined;
		},
		// Load the content for the virtual module
		load(id) {
			return id === resolvedModuleId ? moduleContent : undefined;
		},
	};
}

// Helper type for Vite plugins
type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number]; 