const CONTENT_TYPE = "application/octet-stream";
export const putPresignedUrl = async ({
  url,
  body,
}: {
  url: string;
  body: File;
}) => {
  return fetch(url, {
    method: "PUT",
    body: body,
    headers: {
      "Content-Type": CONTENT_TYPE,
    },
  });
};
