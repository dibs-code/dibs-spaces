import { useDibsSharesWrite, useErc20Decimals, usePrepareDibsSharesDeployBondingToken } from 'abis/types/generated';
import { DibsSharesAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { isAddress, parseEther, parseUnits } from 'viem';
import { Address } from 'wagmi';

const Shares = () => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    connectorToken: '',
    connectorWeight: '',
    initialSupply: '',
    initialPrice: '',
  });

  const dibsSharesAddress = useContractAddress(DibsSharesAddressMap);

  const { data: connectorTokenDecimals } = useErc20Decimals({
    address: isAddress(formData.connectorToken) ? formData.connectorToken : undefined,
  });

  const args = useMemo(
    () =>
      formData.name &&
      formData.symbol &&
      formData.connectorToken &&
      formData.connectorWeight &&
      formData.initialSupply &&
      formData.initialPrice &&
      connectorTokenDecimals !== undefined
        ? ([
            formData.name,
            formData.symbol,
            formData.connectorToken as Address,
            Number((Number(formData.connectorWeight) * 100).toFixed(2)),
            parseEther(formData.initialSupply),
            parseUnits(formData.initialPrice, connectorTokenDecimals),
          ] as [string, string, `0x${string}`, number, bigint, bigint])
        : undefined,
    [formData, connectorTokenDecimals],
  );

  const {
    config: deployBondingTokenConfig,
    error,
    isError,
  } = usePrepareDibsSharesDeployBondingToken({
    address: dibsSharesAddress,
    args,
  });

  const { write: deployBondingToken } = useDibsSharesWrite(deployBondingTokenConfig);

  const onSubmit = useCallback(() => {
    if (deployBondingToken) {
      try {
        deployBondingToken();
      } catch (e) {
        console.log('deployBondingToken error');
        console.log(e);
      }
    } else {
      if (isError) {
        console.log({ args });
        console.log(error);
      } else {
        console.log('deployBondingToken not defined');
      }
    }
  }, [deployBondingToken, isError, args, error]);

  const hasMoreThanTwoDecimals = (value: number) => {
    const decimalPart = value.toString().split('.')[1];
    return decimalPart && decimalPart.length > 2;
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    const name = event.target.name;

    if (name === 'connectorWeight') {
      const valueAsNumber = Number(value);
      if (valueAsNumber > 100) {
        value = '100';
      } else {
        if (hasMoreThanTwoDecimals(valueAsNumber)) {
          value = valueAsNumber.toFixed(2);
        }
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <form className="space-y-4 text-white">
        <div>
          <label className="pr-2">Name</label>
          <input
            className="form-input text-black"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="pr-2">Symbol</label>
          <input
            className="form-input text-black"
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="pr-2">Connector Token</label>
          <input
            className="form-input text-black"
            type="text"
            name="connectorToken"
            value={formData.connectorToken}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="pr-2">Connector Weight (Percentage)</label>
          <input
            className="form-input text-black"
            type="number"
            step="0.01"
            min="0"
            name="connectorWeight"
            value={formData.connectorWeight}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="pr-2">Initial Supply</label>
          <input
            className="form-input text-black"
            type="number"
            name="initialSupply"
            value={formData.initialSupply}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="pr-2">Initial Price</label>
          <input
            className="form-input text-black"
            type="number"
            name="initialPrice"
            value={formData.initialPrice}
            onChange={handleChange}
          />
        </div>
        {/* Add submit functionality here */}
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="btn-primary text-black py-2 px-8"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Shares;
