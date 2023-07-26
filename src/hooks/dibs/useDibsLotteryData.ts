import { useQuery } from '@apollo/client';
import {
  useDibsFirstRoundStartTime,
  useDibsLotteryGetActiveLotteryRound,
  useDibsLotteryGetRoundWinners,
  useDibsRoundDuration,
} from 'abis/types/generated';
import { USER_TICKETS } from 'apollo/queries';
import { DibsAddressMap } from 'constants/addresses';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export enum LotteryStatus {
  UNKNOWN,
  WON,
  LOST,
}

export function useDibsLotteryData() {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const { dibsLotteryAddress } = useDibsAddresses();
  const { data: activeLotteryRound } = useDibsLotteryGetActiveLotteryRound({
    address: dibsLotteryAddress,
  });

  const { data: firstRoundStartTime } = useDibsFirstRoundStartTime({
    address: dibsAddress,
  });

  const { data: roundDuration } = useDibsRoundDuration({
    address: dibsAddress,
  });

  const { address } = useAccount();

  const userLotteryTickets = useQuery(USER_TICKETS, {
    variables: { user: address?.toLowerCase(), round: Number(activeLotteryRound) },
  });

  const { data: lotteryWinners } = useDibsLotteryGetRoundWinners({
    address: dibsLotteryAddress,
    args: activeLotteryRound ? [activeLotteryRound - 1] : undefined,
  });

  const userLotteryStatus = useMemo(() => {
    if (!address || !lotteryWinners) return LotteryStatus.UNKNOWN;
    if (lotteryWinners.find((acc) => acc.toLowerCase() === address.toLowerCase())) return LotteryStatus.WON;
    return LotteryStatus.LOST;
  }, [address, lotteryWinners]);

  return {
    activeLotteryRound,
    firstRoundStartTime,
    roundDuration,
    userLotteryTickets: userLotteryTickets.data?.userLotteries,
    userLotteryStatus,
  };
}
