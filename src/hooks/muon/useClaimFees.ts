import { prepareWriteContract, writeContract } from '@wagmi/core';
import MuonInterfaceABI from 'abis/muonInterface';
import { useDibsAddresses } from 'hooks/dibs/useDibsAddresses';
import { BalanceToClaimObject, useDibsData } from 'hooks/dibs/useDibsData';
import useGetMuonSignature from 'hooks/muon/useMuonSignature';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import Web3 from 'web3';

export const useClaimFees = () => {
  const { address } = useAccount();
  const [pending, setPending] = useState(false);
  const getMuonSignature = useGetMuonSignature();
  const { projectId } = useDibsData();
  const { muonInterfaceAddress } = useDibsAddresses();

  const handleClaimFees = useCallback(
    async (balanceToClaim: BalanceToClaimObject) => {
      if (!address || !muonInterfaceAddress) return;
      const timestamp = Math.floor(Date.now() / 1000);
      setPending(true);
      let sig;
      try {
        sig = await getMuonSignature(address, timestamp);
      } catch (error) {
        setPending(false);
        return;
      }
      let muonVerificationData;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_MUON_API_URL}v1/?app=dibsGlobal&method=claim&params[user]=${address}&params[projectId]=${projectId}&params[token]=${balanceToClaim.tokenAddress}&params[time]=${timestamp}&params[sign]=${sig}`,
          {
            method: 'get',
          },
        );
        const res = await response.json();
        if (res.success) {
          muonVerificationData = res.result;
        } else {
          setPending(false);
          return;
        }
      } catch (error) {
        console.log('sig verify error :>> ', error);
        setPending(false);
        return;
      }
      try {
        const { request } = await prepareWriteContract({
          address: muonInterfaceAddress,
          abi: MuonInterfaceABI,
          functionName: 'claim',
          args: [
            address,
            Web3.utils.toChecksumAddress(balanceToClaim.tokenAddress) as `0x${string}`,
            address,
            BigInt(balanceToClaim.accumulativeBalance.toString()),
            BigInt(balanceToClaim.balance.toString()),
            muonVerificationData.reqId,
            {
              signature: muonVerificationData.signatures[0].signature,
              owner: muonVerificationData.signatures[0].owner,
              nonce: muonVerificationData.data.init.nonceAddress,
            },
            muonVerificationData.shieldSignature,
          ],
        });
        await writeContract(request);
      } catch (err) {
        console.log('claim error :>> ', err);
        setPending(false);
        return;
      }

      setPending(false);
    },
    [muonInterfaceAddress, address, projectId, getMuonSignature],
  );

  return { callback: handleClaimFees, pending };
};
