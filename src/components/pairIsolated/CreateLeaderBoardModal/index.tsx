import { ModalProps } from 'components/modal';
import CreateLeaderBoardModalContext from 'contexts/CreateLeaderBoardModalContext';
import React from 'react';

export default function CreateLeaderBoardModal(props: ModalProps) {
  return <CreateLeaderBoardModalContext {...props} />;
}
