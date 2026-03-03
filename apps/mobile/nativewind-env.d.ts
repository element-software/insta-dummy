/// <reference types="nativewind/types" />

declare module 'nativewind/preset' {
  import type { Config } from 'tailwindcss';
  const preset: Omit<Config, 'content'>;
  export default preset;
}

/**
 * Module augmentation that adds an overload for withNativeWind accepting Expo's
 * metro config type. The standalone `metro-file-map` types and `@expo/metro`'s
 * forked version are structurally incompatible (the latter adds a `plugins`
 * property to BuildParameters). Adding this overload allows TypeScript to match
 * Expo's ConfigT without any type assertions.
 */
declare module 'nativewind/metro' {
  // Local import inside declare module keeps this file ambient (no top-level imports).
  import type { getDefaultConfig } from 'expo/metro-config';
  type ExpoMetroConfig = ReturnType<typeof getDefaultConfig>;
  export function withNativeWind(
    config: ExpoMetroConfig,
    options?: {
      input: string;
      projectRoot?: string;
      outputDir?: string;
      configPath?: string;
      cliCommand?: string;
      browserslist?: string | null;
      browserslistEnv?: string | null;
      typescriptEnvPath?: string;
      disableTypeScriptGeneration?: boolean;
      inlineRem?: number | false;
    },
  ): ExpoMetroConfig;
}
