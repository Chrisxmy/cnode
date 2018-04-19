const APP_ID = "wx9f3395e4b727790d";

const APP_SECRET = "ef955d0503f8b1df1b4f28246c8c0e0b";


const axios = require("axios");


let code= `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9f3395e4b727790d&redirect_uri=http://www.xiemengyang.site&response_type=code&scope=SCOPE&state=STATE#wechat_redirect`

const Errors = require("../error");


`021aI0Fc1AK8Ku0S8DIc1yWIEc1aI0FY`

async function getAccessToken(code) {
  if (!code) throw new Errors.ValidationError("code", "code can note empty");
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`;
  axios.get(url).then(res => {
    console.log(res.data)

   if(!res || !res.data) throw new Errors.weChatError('invalid wechat api')

      return res.data
  })
}
getAccessToken(`021aI0Fc1AK8Ku0S8DIc1yWIEc1aI0FY`)

async function saveUserAccessToken(code,tokenObj){


}

let obj = {
  access_token:
    "LynIrZOpNe_6OXmHXwWuBc-28qP8GvcyfaKj_Uf8QWLh3YkIyjdJYgCdcdXcuOGnMi7mSjHA7_-Z1jpcp8YzAw",
  expires_in: 7200,
  refresh_token:
    "eCSZR18et_-fZJQN5w2hyCsHRB7xtAmcazbmEx6IljdmcxuIG0JVbkBprdsO4eRYWuK5s_anztnFe1ZeUWHxJA",
  openid: "o4a1gwzuRaLIsKVDiChLlZqbxcFI",
  scope: "snsapi_userinfo"
};

let user = ` https://api.weixin.qq.com/sns/userinfo?access_token=${obj.access_token}&openid=${obj.openid}&lang=zh_CN `;

axios.get(user).then(res => {
 
});

let userInfo = {
  openid: "o4a1gwzuRaLIsKVDiChLlZqbxcFI",
  nickname: "xmy",
  sex: 1,
  language: "zh_CN",
  city: "苏州",
  province: "江苏",
  country: "中国",
  headimgurl:
    "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJJYJ74BKhY08LibIeZHVG3Iw9VnWR3vCHkHWN9z78ZymmShFfNV6y6ueCO44afw1aNPgxQPBEVHJA/0",
  privilege: []
};
