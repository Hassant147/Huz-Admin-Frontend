import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkUserExistence } from './AuthApis'; // Assuming the API function is in AuthApis.js

const useUserValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateUser = async () => {
      const profile = localStorage.getItem('SignedUp-User-Profile');
      if (profile) {
        const { email } = JSON.parse(profile);
        try {
          const response = await checkUserExistence(email);
          if (response.message === "User does not exist.") {
            localStorage.clear();

            localStorage.removeItem('SignedUp-User-Profile');
            navigate('/sign-in', { state: { message: 'Your account does not exist. Please create a new one.' } });
          } else {

            localStorage.setItem('SignedUp-User-Profile', JSON.stringify(response));
          }
        } catch (error) {
          localStorage.clear();
          localStorage.removeItem('SignedUp-User-Profile');
          navigate('/sign-in', { state: { message: 'An error occurred. Please log in again.' } });
        }
      }
    };

    validateUser();
  }, [navigate, location]); // Trigger the effect on location change
};

export default useUserValidation;
