import {
  Button,
  Container,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import TableLayout from './TableLayout.layout';

import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { createRandomUserApiCall } from '../../api/userCreateRandomUser';
import { getAllUserApiCall } from '../../api/userGetAll';
import { useQuery } from '@tanstack/react-query';
import { createRealApiCall } from '../../api/userCreateRealUser';
import { userDeleteApiCall } from '../../api/userDelete';
import CountrySelect from '../../components/CountrySelect/index.component';
import { userActivityApiCall } from '../../api/userActivity';

const ModalGenerateUser = ({
  openedGenerateUser,
  setOpenedGenerateUser,
  onSubmitForm,
  onSubmitLoading,
}) => {
  const GenerateUserSchema = Yup.object().shape({
    number: Yup.number().min(1, 'You must be create at least 1 random user '),
  });
  const form = useForm({
    initialValues: { number: 0 },
    validate: yupResolver(GenerateUserSchema),
  });
  return (
    <Modal
      centered
      opened={openedGenerateUser}
      onClose={() => setOpenedGenerateUser(false)}
      title="Generate Random User"
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit((values) => onSubmitForm(values, form))}>
        <NumberInput
          label="How many user you want to generate?*"
          placeholder="1000"
          disabled={onSubmitLoading}
          {...form.getInputProps('number')}
        />

        <Group position="right" mt="md">
          <Button disabled={onSubmitLoading} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

const ModalCreateUser = ({
  openedCreateUser,
  setOpenedCreateUser,
  onSubmitForm,
  onSubmitLoading,
  clearAllValue,
}) => {
  const GenerateSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
  });
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      gender: 'female',
      country: 'Bangladesh',
    },
    validate: yupResolver(GenerateSchema),
  });
  return (
    <Modal
      centered
      opened={openedCreateUser}
      onClose={() => setOpenedCreateUser(false)}
      title="Create User"
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit((values) => onSubmitForm(values, form))}>
        <TextInput
          py={7}
          label="Name"
          placeholder="example name"
          disabled={onSubmitLoading}
          {...form.getInputProps('name')}
        />
        <TextInput
          py={7}
          label="Email"
          placeholder="test@mail.com"
          disabled={onSubmitLoading}
          {...form.getInputProps('email')}
        />
        <TextInput
          py={7}
          label="Phone Number"
          placeholder="+123456789"
          disabled={onSubmitLoading}
          {...form.getInputProps('phoneNumber')}
        />

        <Select
          py={7}
          label="Select Your Gender"
          defaultValue="female"
          placeholder="Pick one"
          data={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          {...form.getInputProps('gender')}
        />

        <CountrySelect
          py={7}
          label="Select Your Country"
          defaultValue="Bangladesh"
          {...form.getInputProps('country')}
        />
        <Group position="right" mt="md">
          <Button disabled={onSubmitLoading} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default function UserLayout() {
  const [pathParam, setPathParam] = useState({
    limit: 10,
    page: 1,
  });

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    refetch,
  } = useQuery(
    ['users', pathParam],
    () => getAllUserApiCall({ ...pathParam }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: 3000,
    }
  );

  // const [isLoading, isError, errorMessage, userData] =
  //   useGetAllUsers(pathParam,);

  const [openedGenerateUser, setOpenedGenerateUser] = useState(false);
  const [loadingGenerateRandom, setLoadingGenerateRandom] = useState(false);

  const [openedCreateUser, setOpenedCreateUser] = useState(false);
  const [loadingCreateUser, setLoadingCreateUser] = useState(false);

  const refetchData = () => {
    refetch();
  };

  const createRandomUser = async (data, form) => {
    setLoadingGenerateRandom(true);
    console.log(data);
    try {
      await createRandomUserApiCall(data.number);
      setOpenedGenerateUser(false);
      refetchData();
      form.reset();
    } catch (error) {
      alert(error.message);
    }
    setLoadingGenerateRandom(false);
  };

  const createNewUserSubmitForm = async (data, form) => {
    setLoadingCreateUser(true);
    console.log(data);
    try {
      await createRealApiCall(data);
      setOpenedCreateUser(false);
      refetchData();
      form.reset();
    } catch (error) {
      alert(error.message);
    }
    setLoadingCreateUser(false);
  };

  const onDeleteClick = async (id) => {
    try {
      const confirmation = window.confirm('Are you sure? ');
      if (confirmation) {
        await userDeleteApiCall(id);
        refetchData();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onClickUserActivity = async (id) => {
    try {
      await userActivityApiCall(id);
      refetchData();
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      <ModalGenerateUser
        openedGenerateUser={openedGenerateUser}
        setOpenedGenerateUser={setOpenedGenerateUser}
        onSubmitForm={createRandomUser}
        onSubmitLoading={loadingGenerateRandom}
      />
      <ModalCreateUser
        openedCreateUser={openedCreateUser}
        setOpenedCreateUser={setOpenedCreateUser}
        onSubmitForm={createNewUserSubmitForm}
        onSubmitLoading={loadingCreateUser}
      />
      <Container size="xl" style={{ margin: 'auto auto' }}>
        <div>
          <Group style={{ margin: '50px 0' }} position="left">
            <Button onClick={() => setOpenedGenerateUser(true)}>
              Generate Random User
            </Button>
            <Button onClick={() => setOpenedCreateUser(true)}>
              Add a New User
            </Button>
            <Button onClick={() => refetchData()}>Refresh</Button>
          </Group>
          <TableLayout
            data={data?.data?.result || []}
            isLoading={isLoading}
            onClickDelete={onDeleteClick}
            onClickActivity={onClickUserActivity}
          />
        </div>
        <Group style={{ margin: '10px 0' }} position="center">
          <Button
            disabled={pathParam.page <= 1 ? true : false}
            onClick={() =>
              setPathParam({ ...pathParam, page: pathParam.page - 1 })
            }
          >
            Previous Page
          </Button>
          <Button
            disabled={
              (data?.data?.result || []).length < pathParam.limit ? true : false
            }
            onClick={() =>
              setPathParam({ ...pathParam, page: pathParam.page + 1 })
            }
          >
            Next Page
          </Button>
        </Group>
      </Container>
    </>
  );
}
