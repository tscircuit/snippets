import { useEffect, useRef, useState } from "react"
import { useUrlParams } from "./use-url-params"
import axios from "redaxios"
import { defaultCodeForBlankPage } from "@/lib/defaultCodeForBlankCode"
import { useLocation, useParams } from "wouter"
import { useMutation } from "react-query"
import { useSnippetByName } from "./use-snippet-by-name"
import { blankPackageTemplate } from "@/lib/templates/blank-package-template"
import { blankFootprintTemplate } from "@/lib/templates/blank-footprint-template"
import { blankCircuitBoardTemplate } from "@/lib/templates/blank-circuit-board-template"
import { blank3dModelTemplate } from "@/lib/templates/blank-3d-model-template"

export const useCurrentSnippetId = (): string | null => {
  const urlParams = useUrlParams()
  const urlSnippetId = urlParams.snippet_id
  const template = urlParams.template
  const wouter = useParams()
  const [location] = useLocation()
  const [snippetIdFromUrl, setSnippetId] = useState<string | null>(urlSnippetId)

  const { data: snippetByName } = useSnippetByName(
    wouter.author && wouter.snippetName
      ? `${wouter.author}/${wouter.snippetName}`
      : null,
  )

  const getTemplateContent = (template: string | undefined) => {
    switch (template) {
      case "blank-circuit-module":
        return blankPackageTemplate
      case "blank-footprint":
        return blankFootprintTemplate
      case "blank-circuit-board":
        return blankCircuitBoardTemplate
      case "blank-3d-model":
        return blank3dModelTemplate
      default:
        return defaultCodeForBlankPage
    }
  }

  const createSnippetMutation = useMutation({
    mutationKey: ["createSnippet"],
    mutationFn: async () => {
      console.log("creating snippet")
      const {
        data: { snippet },
      } = await axios.post("/api/snippets/create", {
        content: getTemplateContent(template),
        owner_name: "seveibar",
      })
      return snippet
    },
    onSuccess: (snippet: any) => {
      const url = new URL(window.location.href)
      url.searchParams.set("snippet_id", snippet.snippet_id)
      url.searchParams.delete("template")
      window.history.pushState({}, "", url.toString())
      setSnippetId(snippet.snippet_id)
    },
    onError: (error: any) => {
      console.error("Error creating snippet:", error)
    },
  })

  useEffect(() => {
    if (snippetIdFromUrl) return
    if (location !== "/editor") return
    if (wouter?.author && wouter?.snippetName) return
    if ((window as any).AUTO_CREATED_SNIPPET) return
    ;(window as any).AUTO_CREATED_SNIPPET = true
    createSnippetMutation.mutate()
    return () => {
      setTimeout(() => {
        ;(window as any).AUTO_CREATED_SNIPPET = false
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (template) {
      const url = new URL(window.location.href)
      url.searchParams.delete("template")
      window.history.replaceState({}, "", url.toString())
    }
  }, [template])

  return snippetIdFromUrl ?? snippetByName?.snippet_id ?? null
}