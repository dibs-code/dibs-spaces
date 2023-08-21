import { useDibsFirstRoundStartTime } from 'abis/types/generated';
import { DibsAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import useTestOrRealData from 'hooks/useTestOrRealData';
import { useEffect, useMemo, useState } from 'react';

export function useNow() {
  const [now, setNow] = useState(new Date().getTime() / 1000);
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime() / 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return now;
}

export function useDibsCurrentDay() {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const { chainId } = useTestOrRealData();
  const { data: firstRoundStartTime } = useDibsFirstRoundStartTime({
    address: dibsAddress,
    chainId,
  });
  const now = useNow();
  return useMemo(
    () => (firstRoundStartTime ? Math.floor((now - firstRoundStartTime) / 86400) : undefined),
    [firstRoundStartTime, now],
  );
}

export default function useEpochTimer() {
  const dibsAddress = useContractAddress(DibsAddressMap);
  const { chainId } = useTestOrRealData();
  const { data: firstRoundStartTime } = useDibsFirstRoundStartTime({
    address: dibsAddress,
    chainId,
  });

  const [epochTimer, setEpochTimer] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const now = useNow();
  const currentDay = useDibsCurrentDay();
  useEffect(() => {
    if (firstRoundStartTime && currentDay) {
      const nextEpoch = firstRoundStartTime + Math.ceil((now - firstRoundStartTime) / 86400) * 86400;
      const hours = Math.floor((nextEpoch - now) / 3600);
      const minutes = Math.floor((nextEpoch - now - hours * 3600) / 60);
      const seconds = Math.floor(nextEpoch - now - hours * 3600 - minutes * 60);
      setEpochTimer({
        hours: hours < 10 ? '0' + hours : String(hours),
        minutes: minutes < 10 ? '0' + minutes : String(minutes),
        seconds: seconds < 10 ? '0' + seconds : String(seconds),
      });
    }
  }, [now, firstRoundStartTime, currentDay]);

  return epochTimer;
}
