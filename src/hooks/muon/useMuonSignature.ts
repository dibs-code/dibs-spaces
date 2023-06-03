import { signTypedData } from '@wagmi/core';
import { useCallback } from 'react';

export default function useGetMuonSignature() {
  return useCallback((user: `0x${string}` | null | undefined, timestamp: number) => {
    if (!user) {
      return;
    }
    return signTypedData({
      types: {
        Message: [
          { type: 'address', name: 'user' },
          { type: 'uint256', name: 'timestamp' },
        ],
      },
      primaryType: 'Message',
      domain: { name: 'Dibs' },
      message: { user, timestamp: BigInt(timestamp) },
    });
  }, []);
}
