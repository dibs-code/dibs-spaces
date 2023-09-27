import { Interface } from '@ethersproject/abi';
import { waitForTransaction } from '@wagmi/core';
import {
  dibsSharesABI,
  useDibsSharesWrite,
  useErc20Decimals,
  usePrepareDibsSharesDeployBondingToken,
} from 'abis/types/generated';
import { DibsSharesAddressMap } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoutePath from 'routes';
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

  const initialPriceParsed = useMemo(
    () =>
      formData.initialPrice && connectorTokenDecimals
        ? parseUnits(formData.initialPrice, connectorTokenDecimals)
        : undefined,
    [formData.initialPrice, connectorTokenDecimals],
  );

  const args = useMemo(
    () =>
      formData.name &&
      formData.symbol &&
      formData.connectorToken &&
      formData.connectorWeight &&
      formData.initialSupply &&
      initialPriceParsed
        ? ([
            formData.name,
            formData.symbol,
            formData.connectorToken as Address,
            Number((Number(formData.connectorWeight) * 10000).toFixed(4)),
            parseEther(formData.initialSupply),
            initialPriceParsed,
          ] as [string, string, `0x${string}`, number, bigint, bigint])
        : undefined,
    [formData, initialPriceParsed],
  );

  const {
    config: deployBondingTokenConfig,
    error,
    isError,
  } = usePrepareDibsSharesDeployBondingToken({
    address: dibsSharesAddress,
    args,
  });

  const { write: deployBondingToken, data } = useDibsSharesWrite(deployBondingTokenConfig);

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
        console.log(error);
      } else {
        console.log('deployBondingToken not defined');
      }
    }
  }, [deployBondingToken, isError, error]);

  const navigate = useNavigate();
  useEffect(() => {
    let loading = false;

    async function getDeployedBondingCurveAddress() {
      if (data?.hash && !loading) {
        loading = true;
        const txData = await waitForTransaction({
          hash: data.hash,
        });
        const iface = new Interface(dibsSharesABI);
        const events = txData.logs.map((l) => {
          try {
            return iface.parseLog(l);
          } catch (_e) {
            return null;
          }
        });
        const bondingTokenDeployedEvent = events.find((e) => e?.name === 'BondingTokenDeployed');
        const bondingTokenAddress: Address = bondingTokenDeployedEvent?.args.bondingToken;
        loading = false;
        if (!bondingTokenAddress) {
          throw new Error('Error: Could not get the created contract address');
        }
        navigate(RoutePath.SHARES_SHARE.replace(':address', bondingTokenAddress));
      }
    }

    getDeployedBondingCurveAddress();
  }, [data?.hash, navigate]);

  const hasMoreThanFourDecimals = (value: number) => {
    const decimalPart = value.toString().split('.')[1];
    return decimalPart && decimalPart.length > 4;
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    const name = event.target.name;

    if (name === 'connectorWeight') {
      const valueAsNumber = Number(value);
      if (valueAsNumber > 100) {
        value = '100';
      } else {
        if (hasMoreThanFourDecimals(valueAsNumber)) {
          value = (Math.floor(valueAsNumber * 10000) / 10000).toString();
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
            data-testid="shares-name-input"
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
            data-testid="shares-symbol-input"
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
            data-testid="shares-connector-token-input"
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
            data-testid="shares-connector-weight-input"
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
            data-testid="shares-initial-supply-input"
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
            data-testid="shares-initial-price-input"
            type="number"
            name="initialPrice"
            value={formData.initialPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="btn-primary text-black py-2 px-8"
            data-testid="shares-submit-button"
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
