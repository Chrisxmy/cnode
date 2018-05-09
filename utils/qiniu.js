var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

const ACCESS_KEY = 'CmAKcOAfAkVbuC8zYvM35G5mqwPZQztcvHoLTrep';
const SECRET_KEY = 'CwCkODS-aS8V0o44pezTCavhZfC29w341fZTGU2D';


config.ACCESS_KEY = ACCESS_KEY
config.SECRET_KEY =SECRET_KEY

const bucket = 'xmy-xyy';
//上传到七牛后保存的文件名
const key = 'test.png';

var mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);

var options = {
    scope: bucket,
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken=putPolicy.uploadToken(mac);
//要上传的空间




//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
var localFile = "/Users/shel/Documents/cnode/utils/test.png";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();


// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});