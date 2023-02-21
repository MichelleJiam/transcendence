export enum TokenType {
  PARTIAL = "partial",
  FULL = "full",
}

export interface TokenPayload {
  sub: number; // user id
  type: TokenType;
}
