import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllUserApiCall } from '../api/userGetAll';

export function useGetAllUsers(options = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      let data = {};

      try {
        data = await getAllUserApiCall(options);
        data = data.data?.result;
      } catch (error) {
        setErrorMessage(error.response?.data || { message: error.message });
        setIsError(true);
      }

      setIsLoading(false);
      setUserData(data);
    };

    getAllUsers();
  }, [options]);

  return [isLoading, isError, errorMessage, userData];
}
export default useGetAllUsers;
