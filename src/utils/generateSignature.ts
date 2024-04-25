import type { SignApiOptions } from "cloudinary";

export async function generateSignature(
  callback: (signature: string) => void,
  paramsToSign: SignApiOptions
) {
  await fetch(`/api/sign`, {
    method: "POST",
    body: JSON.stringify({
      paramsToSign,
    }),
  })
    .then((r) => r.json())
    .then(({ signature }) => {
      callback(signature as string);
    });
}
