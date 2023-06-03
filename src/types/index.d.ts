export enum TransactionStatus {
  SUCCESS,
  PENDING,
}

export type Transaction = {
  status: TransactionStatus;
  type: string;
  message: string;
  amount: string;
  tokenSymbol: string;
  amountTo: string;
};

export type MuonVerificationData = {
  success: boolean;
  result: {
    app: string;
    appId: string;
    cid: string;
    confirmed: boolean;
    confirmedAt: number;
    data: {
      init: {
        nonceAddress: string;
      };
      params: {
        sign: string;
        time: string;
        token: string;
        user: string;
      };
      result: {
        balance: string;
        token: string;
        user: string;
      };
      signParams: {
        name?: string;
        type: string;
        value: string;
      }[];
      timestamp: number;
      uid: string;
    };
    gwAddress: string;
    method: string;
    nSign: number;
    nodeSignature: string;
    reqId: string;
    shieldAddress: string;
    shieldSignature: string;
    signatures: {
      owner: string;
      ownerPubKey: { x: string; yParity: string };
      result: { user: string; token: string; balance: string };
      signature: string;
      timestamp: number;
    }[];
    startedAt: number;
  };
};
