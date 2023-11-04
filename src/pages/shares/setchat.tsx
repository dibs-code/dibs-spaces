import axios from 'axios';
import useDibsSharesChatSignature from 'hooks/dibs/useDibsSharesChatSignature';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DibsShareChatInfo } from 'types';

const SharesSetChat = () => {
  const { id: dibsShareChatInfoId } = useParams();
  const [requestData, setRequestData] = useState<DibsShareChatInfo | null>(null);
  useEffect(() => {
    async function getData() {
      setRequestData(
        (
          await axios.get(
            process.env.REACT_APP_DIBS_SHARES_BACKEND_URL + '/api/dibsShareChatInfo/' + dibsShareChatInfoId,
          )
        ).data,
      );
    }

    getData();
  }, [dibsShareChatInfoId]);

  const { signDibsShareChatInfo } = useDibsSharesChatSignature();
  return requestData ? (
    <div className="text-white bg-gray-800 p-6">
      <div>
        Please sign the request to set <span className="fond-bold">{requestData.chatInfo.title}</span>{' '}
        {requestData.chatInfo.type} as share holders&apos; group for{' '}
        <span className="fond-bold">{requestData.dibsShareAddress}</span>:
      </div>
      <button
        onClick={() => {
          const timestamp = Math.floor(new Date().getTime() / 1000);
          signDibsShareChatInfo(requestData, BigInt(timestamp))
            .then((signature) => {
              axios
                .post(
                  process.env.REACT_APP_DIBS_SHARES_BACKEND_URL +
                    '/api/dibsShareChatInfo/' +
                    dibsShareChatInfoId +
                    '/verify',
                  {
                    signature,
                    timestamp,
                  },
                )
                .then(() => {
                  alert('Chat was set successfully!');
                })
                .catch((e) => alert('Error: ' + String(e)));
            })
            .catch(console.log);
        }}
        className="btn-primary text-black py-2 px-8"
        type="submit"
      >
        Sign
      </button>
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default SharesSetChat;
