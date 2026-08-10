import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

let cloudinaryConfigured = false;
function ensureCloudinary() {
  if (cloudinaryConfigured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return;
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  cloudinaryConfigured = true;
}

export function storageDriver(): "cloudinary" | "local" {
  return process.env.CLOUDINARY_CLOUD_NAME ? "cloudinary" : "local";
}

export async function uploadImage(buffer: Buffer, contentType: string): Promise<string> {
  if (storageDriver() === "cloudinary") {
    ensureCloudinary();
    const b64 = `data:${contentType};base64,${buffer.toString("base64")}`;
    const res = await cloudinary.uploader.upload(b64, {
      folder: process.env.CLOUDINARY_FOLDER || "vankhanh",
      resource_type: "image",
    });
    return res.secure_url;
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  const name = crypto.randomBytes(10).toString("hex") + "." + ext;
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}
