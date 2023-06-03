// @flow
import { faArrowUpFromLine } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'components/modal/index';
import React, { PropsWithChildren } from 'react';
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink';
import { useNetwork } from 'wagmi';

export interface SubmittedTxModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  hash: string | null;

  closeModal(): void;
}

export type SubmittedTxModalProps = PropsWithChildren<SubmittedTxModalPropsInterface>;

const SubmittedModal = (props: SubmittedTxModalProps) => {
  const { chain } = useNetwork();
  const { hash, closeModal } = props;
  const open = !!hash;
  return (
    <div>
      <Modal open={open} closeModal={closeModal}>
        <main className={'flex flex-col gap-8 justify-center items-center'}>
          <FontAwesomeIcon style={{ fontSize: 96 }} icon={faArrowUpFromLine}></FontAwesomeIcon>
          <div className={'text-center'}>
            <h3 className={'font-normal'}>Transition Submitted</h3>
            {chain?.id && hash && (
              <a
                className={' text-primary text-lg font-normal cursor-pointer'}
                href={getExplorerLink(chain?.id, hash, ExplorerDataType.TRANSACTION)}
                target={'_blank'}
                rel="noreferrer"
              >
                View on Explorer
              </a>
            )}
          </div>
          <div>
            <button onClick={closeModal} className={'btn-medium btn-primary-inverted px-12 outline-0'}>
              Close
            </button>
          </div>
        </main>
      </Modal>
    </div>
  );
};
export default SubmittedModal;
