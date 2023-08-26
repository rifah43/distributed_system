const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost', 
    port: 9000,                            
    useSSL: false,                         
    accessKey: 'GBzPdnxBiXR1kDqmEbJ1',     
    secretKey: 'lMScjzApgvN8So2z4YfpyimNFyAmFQtjBuTkKYBx', 
    region: 'ap-south-1'         
  });

  module.exports.minioClient=minioClient;
  