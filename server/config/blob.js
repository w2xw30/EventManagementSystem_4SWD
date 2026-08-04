const { put } = require("@vercel/blob");

async function uploadImage(file) {
  const filename = `${Date.now()}-${file.originalname}`;

  const blob = await put(filename, file.buffer, {
    access: "public",
    contentType: file.mimetype,
  });

  return blob.url;
}

module.exports = { uploadImage };
