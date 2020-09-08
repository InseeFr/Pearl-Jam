import React, { useContext } from 'react';
import Modal from 'react-modal';
import Icon from '../icon/email.icon';
import Form from './form';
import SurveyUnitContext from '../../UEContext';

Modal.setAppElement('#root');

const UEItem = ({ saveUE }) => {
  const ue = useContext(SurveyUnitContext);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const customStyles = {
    content: {
      backgroundColor: '#eeeeee',
      border: '3px solid black',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const save = surveyUnit => {
    saveUE(surveyUnit);
    closeModal();
  };

  const nope = () => {};

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <Form closeModal={closeModal} surveyUnit={ue} saveUE={save} />
      </Modal>
      <div className="ue-item" onClick={openModal} onKeyPress={nope} role="button" tabIndex="0">
        <Icon width={40} />
        <div className="data">
          <span>{ue.email}</span>
        </div>
      </div>
    </>
  );
};

export default UEItem;
