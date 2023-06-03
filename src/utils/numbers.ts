import BigNumber from 'bignumber.js'

BigNumber.config({ EXPONENTIAL_AT: 30 })

export function toBN(num: BigNumber.Value): BigNumber {
  return new BigNumber(num)
}

export const formatBalance = (balance: BigNumber.Value, fixed = 6): string => {
  const bnBalance = toBN(balance)
  if (
    toBN(10)
      .pow(fixed - 1)
      .lte(bnBalance)
  ) {
    return bnBalance.toFixed(0, BigNumber.ROUND_DOWN)
  }
  return bnBalance.sd(fixed, BigNumber.ROUND_DOWN).toFixed()
}
