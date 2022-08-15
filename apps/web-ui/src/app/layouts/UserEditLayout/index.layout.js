/* eslint-disable react/jsx-no-useless-fragment */
import {
  Container,
  TextInput,
  Button,
  Group,
  Modal,
  Select,
  Text,
  LoadingOverlay,
} from '@mantine/core';
import style from './index.module.scss';

import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';

import CountrySelect from '../../components/CountrySelect/index.component';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTERS } from '../../constent/router.const';
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/Loading/index.component';
import { userGetByIdApiCall } from '../../api/userGetbyId';
import { updateUserInfoApiCall } from '../../api/userUpdateUserInfo';
import { useState } from 'react';

const EditForm = ({
  onSubmitForm,
  onSubmitLoading,
  onBackButtonPress,
  initialValues,
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
    initialValues: { ...initialValues },
    validate: yupResolver(GenerateSchema),
  });

  return (
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
        label="User Name"
        placeholder="example User Name"
        disabled={onSubmitLoading}
        {...form.getInputProps('userName')}
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
      <Group position="center" mt="md">
        <Button onClick={onBackButtonPress} type="button">
          Back
        </Button>
        <Button disabled={onSubmitLoading} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default function UserEditLayout() {
  const navigate = useNavigate();
  const parem = useParams();
  const {
    isLoading,
    isFetching,
    data: userData,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery(['users', parem], () => userGetByIdApiCall(parem.id), {
    initialData: {},
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const onBackButtonPress = () => {
    navigate(APP_ROUTERS.USER_TABLE_PATH);
  };

  const onSubmitUpdateForm = async (data, form) => {
    setIsLoadingSubmit(true);
    try {
      await updateUserInfoApiCall(data);
      form.reset();
      refetch();
    } catch (error) {
      alert(error?.response?.data?.message || error.message);
    }
    setIsLoadingSubmit(false);
  };

  if (isLoading || isFetching || isRefetching) {
    return <LoadingComponent />;
  }

  if (isError) {
    alert(error?.response?.data?.message || error.message);
    return (
      <>
        <div className={style.container}>
          <Container style={{ minHeight: '100vh', margin: 'auto' }}>
            <Text size={40} align="center">
              Page Not find
            </Text>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={style.container}>
        <Container style={{ minHeight: '100vh' }}>
          <div>
            <Text size={40} align="center">
              User Edit Information
            </Text>
          </div>
          <div>
            <div style={{ position: 'relative' }}>
              <LoadingOverlay visible={isLoadingSubmit} overlayBlur={2} />
              <EditForm
                initialValues={userData}
                onSubmitForm={onSubmitUpdateForm}
                onBackButtonPress={onBackButtonPress}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
