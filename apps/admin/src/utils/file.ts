export type ImageFileType =
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "application/pdf";

export const getImageExtension = (type: ImageFileType) => {
  switch (type) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpeg";
    case "image/gif":
      return "gif";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
};
