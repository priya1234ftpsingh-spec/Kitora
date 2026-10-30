import React from 'react';
import Sidebar from './Sidebar.jsx';

const MobileMenu = ({ isOpen, onClose }) => {
  return <Sidebar isOpen={isOpen} onClose={onClose} />;
};

export default MobileMenu;
