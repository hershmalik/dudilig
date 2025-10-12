import { useCallback, useState } from "react";
import { Upload, FileText, Link as LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isAnalyzing: boolean;
}

export function UploadDropzone({ onFileSelect, onUrlSubmit, isAnalyzing }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"file" | "url">("file");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleAnalyze = () => {
    if (mode === "file" && selectedFile) {
      onFileSelect(selectedFile);
    } else if (mode === "url" && url) {
      onUrlSubmit(url);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "file" ? "default" : "outline"}
          onClick={() => setMode("file")}
          className="flex-1"
          data-testid="button-mode-file"
        >
          <FileText className="w-4 h-4 mr-2" />
          Upload PDF
        </Button>
        <Button
          variant={mode === "url" ? "default" : "outline"}
          onClick={() => setMode("url")}
          className="flex-1"
          data-testid="button-mode-url"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          From URL
        </Button>
      </div>

      {mode === "file" ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-all
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
            ${selectedFile ? "bg-card" : "bg-background"}
          `}
          data-testid="dropzone-area"
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-background rounded-md border border-card-border">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground" data-testid="text-filename">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  disabled={isAnalyzing}
                  data-testid="button-clear-file"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
                data-testid="button-analyze"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Pitch Deck"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="w-16 h-16 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  Drop your pitch deck here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <div>
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span data-testid="button-browse">Browse Files</span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  data-testid="input-file"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supports PDF files up to 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/pitch-deck.pdf"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              data-testid="input-url"
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !url}
            className="w-full"
            size="lg"
            data-testid="button-analyze-url"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze from URL"}
          </Button>
        </div>
      )}
    </div>
  );
}
