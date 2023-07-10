enum GeneralEnum {
  OK = 'OK',
  DISABLED_AUTH = 'DISABLED_AUTH',
  DISABLED_CHALLENGE_STATUS_CHECK = 'DISABLED_CHALLENGE_STATUS_CHECK',
  UNAUTHORIZED = 'Unauthorized',
  AUTHORIZATION_HEADER = 'authorization',
  BEARER_PREFIX = 'Bearer ',
  NOT_AUTHORIZED = 'Not authorized, please verify that JWT token is correct',
  BAD_REQUEST = 'Bad request',
  FORBIDDEN = 'Forbidden',
  PRECONDITION_FAILED = 'Precondition failed',
}

export default GeneralEnum;
