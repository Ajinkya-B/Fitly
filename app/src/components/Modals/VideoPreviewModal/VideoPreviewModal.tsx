import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPreviewModalProps {
  previewVideo: string | null;
  setPreviewVideo: (url: string | null) => void;
}

export const VideoPreviewModal = ({
  previewVideo,
  setPreviewVideo,
}: VideoPreviewModalProps) => {
  return (
    <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Exercise Technique</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={previewVideo || ''}
            title="Exercise Video"
            allowFullScreen
            className="w-full h-full rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
