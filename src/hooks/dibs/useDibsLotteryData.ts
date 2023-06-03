import { useQuery } from '@apollo/client';
import {
  useDibsFirstRoundStartTime,
  useDibsLotteryGetActiveLotteryRound,
  useDibsLotteryGetRoundWinners,
  useDibsRoundDuration,
} from 'abis/types/generated';
import { USER_TICKETS } from 'apollo/queries';
import { DibsAddress, DibsLotteryAddress } from 'constants/addresses';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export enum LotteryStatus {
  UNKNOWN,
  WON,
  LOST,
}

export function useDibsLotteryData() {
  const { data: activeLotteryRound } = useDibsLotteryGetActiveLotteryRound({
    address: DibsLotteryAddress,
  });

  const { data: firstRoundStartTime } = useDibsFirstRoundStartTime({
    address: DibsAddress,
  });

  const { data: roundDuration } = useDibsRoundDuration({
    address: DibsAddress,
  });

  const { address } = useAccount();

  const userLotteryTickets = useQuery(USER_TICKETS, {
    variables: { user: address?.toLowerCase(), round: Number(activeLotteryRound) },
  });

  const { data: lotteryWinners } = useDibsLotteryGetRoundWinners({
    address: DibsLotteryAddress,
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
