import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hoooks/http-hook';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState()
  const { isLoding, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const featchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users')
        setLoadedUsers(responseData.users);

      } catch (err) { }
    }
    featchUsers();
  }, [sendRequest])


  return <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoding && <div className='center'>
      <LoadingSpinner />
    </div>}
    {!isLoding && loadedUsers && <UsersList items={loadedUsers} />};
  </React.Fragment>
};

export default Users;
