import { useMemo } from "react"
import * as Babel from "@babel/standalone"

export const safeCompileTsx = (
  code: string,
  manualEdits?: string | null,
):
  | { success: true; compiledTsx: string; error?: undefined }
  | { success: false; error: Error; compiledTsx?: undefined } => {
  try {
    // Add manual edits if it exists
    let codeWithManualEdits = code
    if (manualEdits) {
      // Add the manual edits as a module variable and remove any existing imports
      codeWithManualEdits = `
const __MANUAL_EDITS = ${manualEdits};
${code.replace(/import\s+.*from\s+['"]\.\/manual-edits\.json['"];?\n?/g, "")}
`
        .trim()
        .replace(/manualEdits={[^}]+}/, "manualEdits={__MANUAL_EDITS}")
    }

    return {
      success: true,
      compiledTsx:
        Babel.transform(codeWithManualEdits, {
          presets: ["react", "typescript"],
          plugins: ["transform-modules-commonjs"],
          filename: "virtual.tsx",
        }).code || "",
    }
  } catch (error: any) {
    return { success: false, error }
  }
}

export const useCompiledTsx = (
  code?: string,
  { isStreaming = false }: { isStreaming?: boolean } = {},
) => {
  return useMemo(() => {
    if (!code) return ""
    if (isStreaming) return ""
    const result = safeCompileTsx(code)
    if (result.success) {
      return result.compiledTsx
    }
    return `Error: ${result.error.message}`
  }, [code, isStreaming])
}
