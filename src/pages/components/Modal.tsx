import { motion } from 'framer-motion';
import React from 'react';
import LoginForm from './LoginForm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-opacity-30 z-10 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-info p-8 rounded-lg w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/6">
        <LoginForm />

        {/* <hr /> */}

        <button className="btn btn-accent btn-ghost btn-outline w-full" onClick={onClose}>
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default Modal;
