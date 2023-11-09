const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'lZenjbTsP9RiEOrmTwbZ',
  secretKey: 'wAh7nzy7S3rUqhSdTAfOho49Ezih4DdvUpK75pPe',
  region: 'ap-south-1',
});

module.exports.minioClient = minioClient;