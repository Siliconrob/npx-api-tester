const s3 = require("@aws-sdk/client-s3");
const s3Link = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const s3Client = new s3.S3Client({
  endpoint: process.env.spaces_endpoint,
  forcePathStyle: false,
  region: process.env.spaces_region,
  credentials: {
    accessKeyId: process.env.spaces_access_id,
    secretAccessKey: process.env.spaces_secret,
  },
});

function getUploadParameters(inputData) {
  const base64Data = new Buffer.from(
    inputData.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = inputData.split(";")[0].split("/")[1];
  const params = {
    Bucket: process.env.spaces_bucket,
    Key: `${crypto.randomUUID()}.${type}`,
    Body: base64Data,
    ACL: "private",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
    Metadata: {
      "x-amz-meta-my-key": "Upload File",
    },
  };
  return params;
}

module.exports = {
  uploadImage: async function (fileData) {
    const params = getUploadParameters(fileData);
    const cmd = new s3.PutObjectCommand(params);
    const data = await s3Client.send(cmd);
    console.log(`Successfully uploaded object: ${params.Bucket}/${params.Key}`);
    const getObjectParams = {
      Bucket: params.Bucket,
      Key: params.Key,
    };
    const command = new s3.GetObjectCommand(getObjectParams);
    const shareUrl = await s3Link.getSignedUrl(s3Client, command, {
      expiresIn: process.env.spaces_expires_in,
    });
    console.log(shareUrl);
    return shareUrl;
  },
};
