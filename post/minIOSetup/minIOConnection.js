const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost', 
    port: 9000,                            
    useSSL: false,                         
    accessKey: 'EPCVVnZZADLcuf44khg5',     
    secretKey: 'suxbLA7kU766A0D9C4IMZ2E0ZFfs3yMoe3YUb3RB', 
    region: 'ap-south-1'         
  });

  module.exports.minioClient=minioClient;
  