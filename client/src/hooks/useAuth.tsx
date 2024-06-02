import { useNavigate } from 'react-router-dom';

import useLocalStorage from './useLocalStorage';
import { useEffect } from 'react';

const useAuth = (isSignInPage = false) => {
  const [u, setU] = useLocalStorage('u', null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!u && !isSignInPage) {
      navigate('/signin');
    }

    if (u && isSignInPage) {
      navigate('/');
    }
  }, [])

  return [u, setU];
};

export default useAuth;
