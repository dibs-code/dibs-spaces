import { Address } from 'wagmi';

export type MuonVerificationTopLeaderBoardNMethodData = {
  success: boolean;
  result: {
    app: string;
    appId: string;
    confirmed: boolean;
    confirmedAt: number;
    data: {
      init: {
        nonceAddress: Address;
      };
      params: {
        projectId: string;
        day: string;
        pair: Address;
        n: string;
      };
      result: {
        projectId: string;
        pair: Address;
        day: string;
        n: string;
        topLeaderBoardN: string[];
      };
      signParams: {
        name?: string;
        type: string;
        value: string | number;
      }[];
      timestamp: number;
      uid: string;
    };
    gwAddress: string;
    method: string;
    nSign: number;
    nodeSignature: string;
    reqId: `0x${string}`;
    shieldAddress: string;
    shieldSignature: `0x${string}`;
    signatures: {
      owner: Address;
      ownerPubKey: { x: string; yParity: string };
      signature: string;
      timestamp: number;
    }[];
    startedAt: number;
  };
};
