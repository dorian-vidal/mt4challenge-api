export interface JwtInterface {
  // account ID
  sub: string;

  // date when token was delivered
  iat?: number;

  // expiration date
  exp?: number;
}
