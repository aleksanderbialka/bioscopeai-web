import { useState, useEffect } from "react";
import { Image as ImageIcon, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Card, CardBody } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import { getImageFileUrl } from "../api/images.api.ts";
import type { Image } from "../types/image.types";

interface ImageCardProps {
  image: Image;
  onEdit: (image: Image) => void;
  onDelete: (imageId: string) => void;
  onPreview: (image: Image) => void;
}

export function ImageCard({ image, onEdit, onDelete, onPreview }: ImageCardProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);
  const [hasError, setHasError] = useState(false);

  const formattedDate = new Date(image.uploaded_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadImageUrl() {
      try {
        setIsLoadingUrl(true);
        setHasError(false);
        const url = await getImageFileUrl(image.id);
        if (isMounted) {
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Failed to load image URL:", error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUrl(false);
        }
      }
    }

    loadImageUrl();

    return () => {
      isMounted = false;
    };
  }, [image.id]);

  return (
    <Card hover>
      <CardBody>
        <div className="space-y-4">
          {/* Image Preview */}
          <div 
            className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onPreview(image)}
          >
            {isLoadingUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">
                  <svg className="w-8 h-8 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm mt-2">Loading...</p>
                </div>
              </div>
            ) : hasError || !imageUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm mt-2">Image unavailable</p>
                </div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={image.filename || "Image"}
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
              />
            )}
            
            {/* Analysis Badge Overlay */}
            <div className="absolute top-2 right-2">
              <Badge variant={image.analyzed ? "success" : "warning"}>
                {image.analyzed ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Analyzed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </div>
                )}
              </Badge>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {image.filename || "Untitled"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={async () => {
                try {
                  const url = await getImageFileUrl(image.id);
                  window.open(url, "_blank");
                } catch (error) {
                  console.error("Failed to download image:", error);
                }
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => onEdit(image)}
              className="flex-1 px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(image.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
