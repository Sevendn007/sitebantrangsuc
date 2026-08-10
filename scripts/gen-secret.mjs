import crypto from "node:crypto";
const secret = crypto.randomBytes(48).toString("hex");
console.log("\nAUTH_SECRET=" + secret + "\n");
console.log("Copy dòng trên và dán vào file .env, sau đó khởi động lại server.\n");
