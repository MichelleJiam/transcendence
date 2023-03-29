export enum TokenType {
  PARTIAL = "partial",
  FULL = "full",
}

export interface TokenPayload {
  sub: number; // user id
  intraId: string;
  type: TokenType;
}
