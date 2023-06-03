import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, PropsWithChildren } from 'react';

export interface ModalPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open: boolean;

  closeModal(): void;
}

export type ModalProps = PropsWithChildren<ModalPropsInterface>;

const Modal = (props: ModalProps) => {
  const { open, closeModal, children, className, title } = props;

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`${className} max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <Dialog.Title as="h3" className="relative text-lg font-medium leading-6 text-gray-900 mb-8">
                    {title ? title : ''}
                    <div onClick={closeModal} className={'absolute -right-1 -top-2 p-2 cursor-pointer'}>
                      <FontAwesomeIcon style={{ fontSize: 20 }} className={''} icon={faXmark}></FontAwesomeIcon>
                    </div>
                  </Dialog.Title>

                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          {/* this button is for fixing a warning */}
          {/* https://github.com/tailwindlabs/headlessui/issues/265#issuecomment-851067026 */}
          <button className="opacity-0 absolute bottom-0"></button>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
