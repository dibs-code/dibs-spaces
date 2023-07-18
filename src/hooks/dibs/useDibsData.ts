import { useQuery } from '@apollo/client';
import { multicall } from '@wagmi/core';
import DibsABI from 'abis/dibs';
import { useDibsGetCodeName, useDibsParents, useDibsProjectId } from 'abis/types/generated';
import { ACCUMULATIVE_TOKEN_BALANCES } from 'apollo/queries';
import { DibsAddress } from 'constants/addresses';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

export interface BalanceObject {
  tokenAddress: `0x${string}`;
  balance: bigint;
}

export interface AccBalanceObject extends BalanceObject {
  claimedBalance: bigint;
}

export interface BalanceToClaimObject extends BalanceObject {
  accumulativeBalance: bigint;
}

export function useDibsData() {
  const { address } = useAccount();

  const { data: projectId } = useDibsProjectId({
    address: DibsAddress,
  });

  const { data: addressToName } = useDibsGetCodeName({
    address: DibsAddress,
    args: address ? [address] : undefined,
  });

  const { data: parent } = useDibsParents({
    address: DibsAddress,
    args: address ? [address] : undefined,
  });

  const { data: parentCodeName } = useDibsGetCodeName({
    address: DibsAddress,
    args: parent ? [parent] : undefined,
  });

  const accumulativeTokenBalances = useQuery(ACCUMULATIVE_TOKEN_BALANCES, {
    variables: { user: address?.toLowerCase() },
  });

  const userTokenAddresses = useMemo(() => {
    const tokens: `0x${string}`[] = [];
    accumulativeTokenBalances?.data?.accumulativeTokenBalances.forEach((atb) => {
      tokens.push(atb.token);
    });
    return tokens;
  }, [accumulativeTokenBalances?.data?.accumulativeTokenBalances]);

  const claimedBalancesCall = useMemo(() => {
    if (!address) return [];
    return userTokenAddresses.map((tokenAddress) => ({
      address: DibsAddress,
      abi: DibsABI,
      functionName: 'claimedBalance',
      args: [tokenAddress, address],
    }));
  }, [address, userTokenAddresses]);

  const [claimedBalancesResult, setClaimedBalancesResult] = useState<any[]>([]);
  const getClaimedBalancesResult = useCallback(async () => {
    if (claimedBalancesCall.length) {
      setClaimedBalancesResult(
        await multicall({
          contracts: claimedBalancesCall,
        }),
      );
    }
  }, [claimedBalancesCall]);
  useEffect(() => {
    getClaimedBalancesResult();
  }, [getClaimedBalancesResult, userTokenAddresses]);

  const balances = useMemo((): AccBalanceObject[] => {
    if (!accumulativeTokenBalances?.data || !claimedBalancesResult.length) return [];
    const accBalancesResultLoaded = accumulativeTokenBalances?.data.accumulativeTokenBalances;
    return userTokenAddresses.map((tokenAddress, i) => ({
      tokenAddress,
      balance: BigInt(accBalancesResultLoaded[i].amount),
      claimedBalance: claimedBalancesResult[i].result,
    }));
  }, [accumulativeTokenBalances?.data, claimedBalancesResult, userTokenAddresses]);

  const claimedBalances = useMemo((): BalanceObject[] => {
    return balances.map((b) => ({
      balance: b.claimedBalance,
      tokenAddress: b.tokenAddress,
    }));
  }, [balances]);

  const balancesToClaim = useMemo(() => {
    if (!balances || !address) return [];
    const balancesToClaim: BalanceToClaimObject[] = [];
    balances.forEach((b) => {
      const balanceToClaim = b.balance - b.claimedBalance;
      if (balanceToClaim) {
        balancesToClaim.push({
          accumulativeBalance: b.balance,
          tokenAddress: b.tokenAddress,
          balance: balanceToClaim,
        });
      }
    });
    return balancesToClaim;
  }, [address, balances]);

  return {
    projectId,
    addressToName,
    parentCodeName,
    balances,
    balancesToClaim,
    claimedBalances,
  };
}
