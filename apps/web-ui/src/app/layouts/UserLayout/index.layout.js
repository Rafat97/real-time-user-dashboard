import {
  Button,
  Container,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Text,
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
import { useNavigate } from 'react-router-dom';
import { APP_ROUTERS } from '../../constent/router.const';
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconClearAll,
  IconRefresh,
  IconSearch,
} from '@tabler/icons';

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

const SearchField = ({ onSubmitForm, onSubmitLoading }) => {
  const GenerateUserSchema = Yup.object().shape({
    searchValue: Yup.string().required('Please give some input'),
  });
  const form = useForm({
    initialValues: { searchOption: 'email', searchValue: '' },
    validate: yupResolver(GenerateUserSchema),
  });
  return (
    <form
      style={{ minWidth: `1000px` }}
      onSubmit={form.onSubmit((values) => onSubmitForm(values, form))}
    >
      <Grid my={50}>
        <Grid.Col span={2}>
          <Select
            placeholder="Pick one"
            defaultValue={`email`}
            data={[
              { value: 'email', label: 'Email' },
              { value: 'search', label: 'Search' },
            ]}
            {...form.getInputProps('searchOption')}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          <TextInput
            placeholder={`Search anything`}
            disabled={onSubmitLoading}
            {...form.getInputProps('searchValue')}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Button disabled={onSubmitLoading} type="submit">
            <IconSearch size={20} />
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default function UserLayout() {
  const navigate = useNavigate();
  const [pathParam, setPathParam] = useState({
    limit: 10,
    page: 1,
  });

  const { isLoading, data, refetch } = useQuery(
    ['users', pathParam],
    () => getAllUserApiCall({ ...pathParam }),
    {
      initialData: [],
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

  const onClickUserEdit = async (id) => {
    try {
      navigate(APP_ROUTERS.USER_INFO_EDIT_PATH_PREFIX + '/' + id);
      refetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const onClickSearchFiled = async (data) => {
    try {
      console.log(data);
      const filter = {
        [data.searchOption]: data.searchValue,
      };
      setPathParam({ ...pathParam, ...filter });
    } catch (error) {
      alert(error.message);
    }
  };

  const onClickReset = async () => {
    try {
      setPathParam({
        limit: 10,
        page: 1,
      });
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
      <Container size="xl" style={{ margin: 'auto auto', minHeight: '100vh' }}>
        {(data?.data?.result || []).length <= 0 ? (
          <Group position="center">
            <SearchField onSubmitForm={onClickSearchFiled} />
            <Group style={{ margin: '150px 0' }}>
              <Text size={40} align="center">
                <Group style={{ margin: '50px 0 10px 0' }} position="center">
                  <Button onClick={() => setOpenedGenerateUser(true)}>
                    Generate Random User
                  </Button>
                  <Button onClick={() => setOpenedCreateUser(true)}>
                    Add a New User
                  </Button>
                  <Button onClick={() => onClickReset()}>
                    <IconClearAll size={20} />
                  </Button>
                </Group>
                Oops! No User Found
              </Text>
            </Group>
          </Group>
        ) : (
          <div>
            <SearchField onSubmitForm={onClickSearchFiled} />
            <Grid>
              <Grid.Col span={6}>
                <Group style={{ margin: '50px 0 10px 0' }}>
                  <Button onClick={() => setOpenedGenerateUser(true)}>
                    Generate Random User
                  </Button>
                  <Button onClick={() => setOpenedCreateUser(true)}>
                    Add a New User
                  </Button>
                  <Button onClick={() => refetchData()}>
                    <IconRefresh size={20} />
                  </Button>
                  <Button onClick={() => onClickReset()}>
                    <IconClearAll size={20} />
                  </Button>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group style={{ margin: '50px 0 10px 0' }} position="right">
                  <Button
                    disabled={pathParam.page <= 1 ? true : false}
                    onClick={() =>
                      setPathParam({ ...pathParam, page: pathParam.page - 1 })
                    }
                  >
                    <IconChevronsLeft size={30} />
                  </Button>
                  <Button
                    disabled={
                      (data?.data?.result || []).length < pathParam.limit
                        ? true
                        : false
                    }
                    onClick={() =>
                      setPathParam({ ...pathParam, page: pathParam.page + 1 })
                    }
                  >
                    <IconChevronsRight size={30} />
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
            <TableLayout
              data={data?.data?.result || []}
              isLoading={isLoading}
              onClickDelete={onDeleteClick}
              onClickActivity={onClickUserActivity}
              onClickEdit={onClickUserEdit}
            />
          </div>
        )}
      </Container>
    </>
  );
}
