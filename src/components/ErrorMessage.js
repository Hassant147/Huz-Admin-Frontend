import React from 'react';
import PropTypes from 'prop-types';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, status }) => {
  return (
    <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 my-4 rounded flex items-center">
      <FiAlertCircle className="text-gray-500 mr-2 text-xl" />
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default ErrorMessage;
