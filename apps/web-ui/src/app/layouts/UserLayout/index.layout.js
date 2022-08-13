import {
  Button,
  Checkbox,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Skeleton,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import LoadingComponent from '../../components/Loading/index.component';
import TableLayout from './TableLayout.layout';
import useGetAllUsers from '../../hooks/use-get-user';
import style from './index.module.scss';
// import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { createRandomUserApiCall } from '../../api/userCreateRandomUser';
import { getAllUserApiCall } from '../../api/userGetAll';
import { useQuery } from '@tanstack/react-query';

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
      <form onSubmit={form.onSubmit((values) => onSubmitForm(values))}>
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
}) => {
  const GenerateSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
  });
  const form = useForm({
    initialValues: { name: '', email: '', phoneNumber: '' },
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
      <form onSubmit={form.onSubmit((values) => onSubmitForm(values))}>
        <TextInput
          label="Name"
          placeholder="example name"
          disabled={onSubmitLoading}
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          placeholder="test@mail.com"
          disabled={onSubmitLoading}
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Phone Number"
          placeholder="+123456789"
          disabled={onSubmitLoading}
          {...form.getInputProps('phoneNumber')}
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

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(['users', pathParam], () => getAllUserApiCall({ ...pathParam }), {
      keepPreviousData: true,
    });

  // const [isLoading, isError, errorMessage, userData] =
  //   useGetAllUsers(pathParam,);

  const [openedGenerateUser, setOpenedGenerateUser] = useState(false);
  const [loadingGenerateRandom, setLoadingGenerateRandom] = useState(false);

  const [openedCreateUser, setOpenedCreateUser] = useState(false);
  const [loadingCreateUser, setLoadingCreateUser] = useState(false);

  const createRandomUser = async (data) => {
    setLoadingGenerateRandom(true);
    console.log(data);
    try {
      await createRandomUserApiCall(data.number);
      setOpenedGenerateUser(false);
    } catch (error) {
      alert(error.message);
    }
    setLoadingGenerateRandom(false);
  };

  const createNewUserSubmitForm = async (data) => {
    setLoadingCreateUser(true);
    console.log(data);
    try {
      // setOpenedGenerateUser(false);
    } catch (error) {
      alert(error.message);
    }
    // setLoadingCreateUser(false);
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
          </Group>
          <TableLayout data={data?.data?.result || []} isLoading={isLoading} />
        </div>
        <Group style={{ margin: '10px 0' }} position="center">
          <Button
            disabled={pathParam.page < 1 ? true : false}
            onClick={() =>
              setPathParam({ ...pathParam, page: pathParam.page - 1 })
            }
          >
            Previous Page
          </Button>
          <Button
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
