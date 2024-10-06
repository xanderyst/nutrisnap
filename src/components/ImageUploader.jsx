import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

export default function ImageUploader({
  imagePreview,
  onImageUpload,
  onAnalyze,
  isAnalyzing,
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Upload Food Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded food"
              className="max-w-full h-auto max-h-64 rounded-lg"
            />
          )}
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*;capture=camera" // This enables camera capture
              onChange={handleImageUpload}
              className="w-full max-w-xs cursor-pointer"
            />
            <Button onClick={onAnalyze} disabled={!imagePreview || isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
