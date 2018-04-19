class httpError extends Error {
  constructor(msg, OPCode, httpCode, httpMsg) {
    super(msg)
    this.OPCode = OPCode // 自定义错误码
    this.httpCode = httpCode
    this.httpMsg = httpMsg
    this.name = 'httperror'
  }
  static get ['DEFAULT_OPCODE']() {
    return 10000
  }
}

class InternalError extends httpError {
  constructor(msg) {
    const OPCode = 50000
    const httpMsg = '服务器出错，一会再试'
    super(msg, OPCode, 500, httpMsg)
  }
}

class ValidationError extends httpError {
  constructor(path, reason) {
    const OPCode = 100000
    const httpCode = 400
    super(
      `error validation param, path: ${path}, reason: ${reason}`,
      OPCode,
      httpCode,
      '参数错误，请检查后再试'
    )
    this.name = 'ValidationError'
  }
}

class sign extends ValidationError {
  constructor(username) {
    super('username', `${username} is repeat`)
    this.httpMsg = '这个用户名已经被使用'
    this.OPCode = 200001
    this.httpCode = 200
  }
}

class login extends ValidationError {
  constructor(username) {
    super('username', `${username} is repeat`)
    this.httpMsg = '用户名或密码不存在'
    this.OPCode = 200000
    this.httpCode = 200
  }
}

class weChatError extends ValidationError {
  constructor(msg) {
    super(`wechat api error: ${msg}`, 30001, 500, '微信服务调用失败')
    this.OPCode = 300001
  }
}

module.exports = {
  httpError,
  ValidationError,
  sign,
  InternalError,
  login,
  weChatError
}
