import { signTypedData } from '@wagmi/core';
import { useCallback } from 'react';
import { DibsShareChatInfo } from 'types';
import { Address } from 'wagmi';

export default function useDibsSharesChatSignature() {
  const signDibsShareChatInfo = useCallback(async (req: DibsShareChatInfo, timestamp: bigint) => {
    const domain = {
      name: 'DibsShareChatInfo',
      version: '1',
    } as const;

    const types = {
      DibsShareChatInfo: [
        { name: 'chainId', type: 'uint256' },
        {
          name: 'dibsShareAddress',
          type: 'address',
        },
        { name: 'requestId', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
    } as const;

    const message = {
      chainId: BigInt(req.chainId),
      dibsShareAddress: req.dibsShareAddress,
      requestId: req._id,
      timestamp,
    } as const;

    return signTypedData({
      domain,
      message,
      primaryType: 'DibsShareChatInfo',
      types,
    });
  }, []);

  const signDibsShareChatJoinRequest = useCallback(
    async (dibsShareAddress: Address, chainId: bigint, timestamp: bigint) => {
      const domain = {
        name: 'DibsShareChatJoinRequest',
        version: '1',
      } as const;

      const types = {
        DibsShareChatJoinRequest: [
          { name: 'chainId', type: 'uint256' },
          {
            name: 'dibsShareAddress',
            type: 'address',
          },
          { name: 'timestamp', type: 'uint256' },
        ],
      } as const;

      const message = {
        chainId,
        dibsShareAddress,
        timestamp,
      } as const;

      return signTypedData({
        domain,
        message,
        primaryType: 'DibsShareChatJoinRequest',
        types,
      });
    },
    [],
  );

  return { signDibsShareChatInfo, signDibsShareChatJoinRequest };
}
