"use client";

import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  useFileUpload,
} from "@/components/ui/file-upload";

export function SourceFileUpload({
  onSourceChange,
}: {
  onSourceChange: (value: string) => void;
}) {
  return (
    <FileUpload
      accept="audio/*,image/*,video/*"
      className="min-w-0"
      label="Media file upload"
      maxFiles={1}
      multiple={false}
      onValueChange={(files) => {
        onSourceChange(files[0]?.name ?? "");
      }}
    >
      <FileUploadDropzone className="min-h-28 rounded-none border-cyan-200/25 bg-cyan-100/5 p-5 text-center text-sm text-[var(--vextro-soft)] hover:bg-cyan-100/8 data-dragging:bg-cyan-100/10">
        <UploadCloud className="size-6 text-cyan-200" />
        <p>Drop a video, image, or audio file into the workspace</p>
        <FileUploadTrigger asChild>
          <Button className="mt-1 rounded-none" size="sm" type="button" variant="outline">
            Choose file
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <SelectedFileList />
    </FileUpload>
  );
}

function SelectedFileList() {
  const files = useFileUpload((state) => Array.from(state.files.keys()));

  return (
    <FileUploadList>
      {files.map((file) => (
        <FileUploadItem className="rounded-none border-[var(--vextro-line)] bg-black/15" key={file.name} value={file}>
          <FileUploadItemPreview className="rounded-none" />
          <FileUploadItemMetadata />
          <FileUploadItemDelete asChild>
            <Button aria-label={`Remove ${file.name}`} size="icon-sm" type="button" variant="outline">
              <X data-icon="inline-start" />
            </Button>
          </FileUploadItemDelete>
        </FileUploadItem>
      ))}
    </FileUploadList>
  );
}
