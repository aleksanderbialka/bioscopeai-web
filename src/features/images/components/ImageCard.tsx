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
  const formattedDate = new Date(image.uploaded_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const imageUrl = getImageFileUrl(image.id);

  return (
    <Card hover>
      <CardBody>
        <div className="space-y-4">
          {/* Image Preview */}
          <div 
            className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onPreview(image)}
          >
            <img
              src={imageUrl}
              alt={image.filename || "Image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.className = "hidden";
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="text-gray-400">
                      <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-sm mt-2">Image unavailable</p>
                    </div>
                  </div>
                `;
              }}
            />
            
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
              onClick={() => window.open(getImageFileUrl(image.id, true), "_blank")}
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
