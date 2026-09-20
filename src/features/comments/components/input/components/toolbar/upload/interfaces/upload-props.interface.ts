export interface UploadProps {
  onUpload: (dataUrl: string) => void;
  onError: (message: string) => void;
}
