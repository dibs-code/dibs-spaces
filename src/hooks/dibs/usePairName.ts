import { useErc20Symbol, useUniswapV2PairToken0, useUniswapV2PairToken1 } from 'abis/types/generated';
import { useMemo } from 'react';
import { Address } from 'wagmi';

export default function usePairName(pairAddress: Address | undefined) {
  const { data: token0Address } = useUniswapV2PairToken0({
    address: pairAddress,
  });
  const { data: token0Symbol } = useErc20Symbol({
    address: token0Address,
  });
  const { data: token1Address } = useUniswapV2PairToken1({
    address: pairAddress,
  });
  const { data: token1Symbol } = useErc20Symbol({
    address: token1Address,
  });
  const pairName = useMemo(
    () => (token0Symbol && token1Symbol ? token0Symbol + '/' + token1Symbol : undefined),
    [token0Symbol, token1Symbol],
  );
  return { pairName };
}
