export function generateOpenGraphMetaTagsImage(
  urls: string | string[]
) {
  if (typeof urls === "string") {
    urls = [urls];
  }

  if (!urls || urls.length === 0) {
    return [];
  }

  return urls.map((url) => ({
    property: "og:image",
    content: url,
  }));
}
