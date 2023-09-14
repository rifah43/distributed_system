const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost', 
    port: 9000,                            
    useSSL: false,                         
    accessKey: 'vbZYp0B2DMsmyPGclqDO',     
    secretKey: 'IHsSMRuCkig2UKNTRm32TISbKkFYgjajkY4jiW05', 
    region: 'ap-south-1'         
  });

  module.exports.minioClient=minioClient;
  