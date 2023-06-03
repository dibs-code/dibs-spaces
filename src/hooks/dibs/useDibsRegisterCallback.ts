import { keccak256 } from '@ethersproject/keccak256';
import { toUtf8Bytes } from '@ethersproject/strings';
import DibsABI from 'abis/dibs';
import { useDibsRegister, usePrepareDibsRegister } from 'abis/types/generated';
import { DibsAddress } from 'constants/addresses';
import { useCallback, useMemo, useState } from 'react';
import { readContracts } from 'wagmi';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const useDibsRegisterCallback = (name: string, parentName: string) => {
  const [pending, setPending] = useState(false);

  const yourCode = useMemo(() => keccak256(toUtf8Bytes(name)) as `0x${string}`, [name]);
  const parentCode = useMemo(() => keccak256(toUtf8Bytes(parentName)) as `0x${string}`, [parentName]);

  const { config: registerConfig } = usePrepareDibsRegister({
    address: DibsAddress,
    args: [name, parentCode],
  });
  const { write: register } = useDibsRegister(registerConfig);

  const handleRegister = useCallback(async () => {
    const [resCodeToName, resParentCodeToName] = await readContracts({
      contracts: [
        {
          address: DibsAddress,
          abi: DibsABI,
          functionName: 'codeToAddress',
          args: [yourCode],
        },
        {
          address: DibsAddress,
          abi: DibsABI,
          functionName: 'codeToAddress',
          args: [parentCode],
        },
      ],
    });
    if (resCodeToName.result !== ZERO_ADDRESS) {
      alert('Code already exists');
      return;
    }
    if (resParentCodeToName.result === ZERO_ADDRESS) {
      alert('Parent code does not exist');
      return;
    }
    setPending(true);
    try {
      await register?.();
    } catch (err) {
      console.log('register error :>> ', err);
      setPending(false);
      return;
    }
    setPending(false);
  }, [parentCode, register, yourCode]);

  return { callback: handleRegister, pending };
};
