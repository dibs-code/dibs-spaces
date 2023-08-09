import { useEffect, useState } from 'react';

export default function useEpochTimer() {
  // const dibsAddress = useContractAddress(DibsAddressMap);
  // const { data: firstRoundStartTime } = useDibsFirstRoundStartTime({
  //   address: dibsAddress,
  // });

  const [epochTimer, setEpochTimer] = useState({
    hours: '0',
    minutes: '0',
    seconds: '0',
  });

  const [now, setNow] = useState(new Date().getTime() / 1000);
  useEffect(() => {
    const nextEpoch = Math.ceil(now / 86400) * 86400;
    const hours = Math.floor((nextEpoch - now) / 3600);
    const minutes = Math.floor((nextEpoch - now - hours * 3600) / 60);
    const seconds = Math.floor(nextEpoch - now - hours * 3600 - minutes * 60);
    setEpochTimer({
      hours: hours < 10 ? '0' + hours : String(hours),
      minutes: minutes < 10 ? '0' + minutes : String(minutes),
      seconds: seconds < 10 ? '0' + seconds : String(seconds),
    });
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime() / 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return epochTimer;
}
