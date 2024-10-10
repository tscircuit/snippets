import { useEffect, useMemo, useState } from "react"
import { CodeEditor } from "@/components/CodeEditor"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { CadViewer } from "@tscircuit/3d-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultCodeForBlankPage } from "@/lib/defaultCodeForBlankCode"
import { decodeUrlHashToText } from "@/lib/decodeUrlHashToText"
import { encodeTextToUrlHash } from "@/lib/encodeTextToUrlHash"
import { Button } from "@/components/ui/button"
import { useRunTsx } from "@/hooks/use-run-tsx"
import EditorNav from "./EditorNav"
import { CircuitJsonTableViewer } from "./TableViewer/CircuitJsonTableViewer"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { useAxios } from "@/hooks/use-axios"
import { TypeBadge } from "./TypeBadge"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "react-query"
import { ClipboardIcon, Share, Eye, EyeOff, PlayIcon } from "lucide-react"
import { MagicWandIcon } from "@radix-ui/react-icons"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorTabContent } from "./ErrorTabContent"
import { cn } from "@/lib/utils"

export interface PreviewContentProps {
  code: string
  triggerRunTsx: () => void
  hasUnsavedChanges: boolean
  tsxRunTriggerCount: number
  errorMessage: string | null
  circuitJson: any
}

const PreviewEmptyState = ({
  triggerRunTsx,
}: { triggerRunTsx: () => void }) => (
  <div className="flex items-center gap-3 bg-gray-200 text-center justify-center py-10">
    No circuit json loaded
    <Button className="bg-blue-600 hover:bg-blue-500" onClick={triggerRunTsx}>
      Run Code
      <PlayIcon className="w-3 h-3 ml-2" />
    </Button>
  </div>
)

export const PreviewContent = ({
  code,
  triggerRunTsx,
  hasUnsavedChanges,
  tsxRunTriggerCount,
  errorMessage,
  circuitJson,
}: PreviewContentProps) => {
  return (
    <div className="w-full md:w-1/2 p-2 min-h-[640px]">
      <Tabs defaultValue="pcb">
        <div className="flex items-center gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-500"
            onClick={() => triggerRunTsx()}
            disabled={hasUnsavedChanges && tsxRunTriggerCount !== 0}
          >
            Run
            <PlayIcon className="w-3 h-3 ml-2" />
          </Button>
          <div className="flex-grow" />
          <TabsList>
            <TabsTrigger value="pcb">PCB</TabsTrigger>
            <TabsTrigger value="cad">3D</TabsTrigger>
            <TabsTrigger value="table">JSON</TabsTrigger>
            <TabsTrigger value="error">
              Errors
              {errorMessage && (
                <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
                  1
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="pcb">
          <div className="mt-4 h-[500px]">
            <ErrorBoundary fallback={<div>Error loading PCB viewer</div>}>
              {circuitJson ? (
                <PCBViewer key={tsxRunTriggerCount} soup={circuitJson} />
              ) : (
                <PreviewEmptyState triggerRunTsx={triggerRunTsx} />
              )}
            </ErrorBoundary>
          </div>
        </TabsContent>
        <TabsContent value="cad">
          <div className="mt-4 h-[500px]">
            <ErrorBoundary fallback={<div>Error loading 3D viewer</div>}>
              {circuitJson ? (
                <CadViewer soup={circuitJson as any} />
              ) : (
                <PreviewEmptyState triggerRunTsx={triggerRunTsx} />
              )}
            </ErrorBoundary>
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="mt-4 h-[500px]">
            <ErrorBoundary fallback={<div>Error loading 3D viewer</div>}>
              {circuitJson ? (
                <CircuitJsonTableViewer elements={circuitJson as any} />
              ) : (
                <PreviewEmptyState triggerRunTsx={triggerRunTsx} />
              )}
            </ErrorBoundary>
          </div>
        </TabsContent>
        <TabsContent value="error">
          <ErrorTabContent code={code} errorMessage={errorMessage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
