import style from './index.module.scss';
import { useEffect } from 'react';
import {
  Avatar,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconApi, IconUsers, IconWorld } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { getTotalUserCounter } from '../../api/userCounter';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uniqueid from 'lodash/uniqueid';
import { allRequestCounterApiCall } from '../../api/allRequestCounter';
import {
  allCountryCounterApiCall,
  Top15UserCounterApiCall,
} from '../../api/totalCountry';
import MaleFemaleCountLayout from './MaleFemaleCount.layout';
import TopCountryCountLayout from './TopCountryCount.layout';
import TopActiveUserCountLayout from './TopActiveUserCountLayout.layout';

const UserCountLayout = ({ text, count, icon = null }) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {/* <Card.Section></Card.Section> */}
      <Grid align="start">
        <Grid.Col md={9} span={3}>
          <Stack>
            <div>
              <Text weight={700} size="xl" align="left">
                {text}
              </Text>
            </div>
            <div>
              <Text weight={700} size="xl" align="left">
                {count}
              </Text>
            </div>
          </Stack>
        </Grid.Col>
        <Grid.Col md={3} span={3}>
          <Group position="right">
            <div>
              <Avatar size="lg" color="blue" radius="xl">
                {icon}
              </Avatar>
            </div>
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default function DashboardLayout() {
  const { isLoading, error, data } = useQuery(
    ['userCounter'],
    getTotalUserCounter,
    {
      refetchInterval: 1000,
    }
  );

  const { data: allRequestCounter } = useQuery(
    ['allRequestCounter'],
    allRequestCounterApiCall,
    {
      refetchInterval: 1000,
    }
  );

  const { data: allCountryCounter } = useQuery(
    ['allCountryCounter'],
    allCountryCounterApiCall,
    {
      refetchInterval: 5000,
    }
  );

  const [state, handlers] = useListState([
    {
      symbol: uniqueid('DashboardLayout_'),
      componentType: 'USER_COUNTER',
    },
    {
      symbol: uniqueid('DashboardLayout_'),
      componentType: 'ALL_REQUEST_COUNTER',
    },
    {
      symbol: uniqueid('DashboardLayout_'),
      componentType: 'ALL_COUNTRY_COUNTER',
    },
  ]);

  const onHandleOnDragEnd = (data) => {
    console.log(data);
    return handlers.reorder({
      from: data.source.index,
      to: data.destination?.index || 0,
    });
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  const items = state.map((item, index) => (
    <Draggable key={item.symbol} index={index} draggableId={item.symbol}>
      {(provided) => (
        <Grid.Col
          md={4}
          span={5}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {item.componentType === 'USER_COUNTER' && (
            <UserCountLayout
              text={`Total Users`}
              count={data?.countInternationalSystem || 0}
              icon={<IconUsers size={30} />}
            />
          )}

          {item.componentType === 'ALL_REQUEST_COUNTER' && (
            <UserCountLayout
              text={`Total Request`}
              count={allRequestCounter?.countInternationalSystem || 0}
              icon={<IconApi size={30} />}
            />
          )}

          {item.componentType === 'ALL_COUNTRY_COUNTER' && (
            <UserCountLayout
              text={`Total Country`}
              count={allCountryCounter?.allCountry || 0}
              icon={<IconWorld size={30} />}
            />
          )}
        </Grid.Col>
      )}
    </Draggable>
  ));

  return (
    <div className={style.container}>
      <Container>
        <DragDropContext onDragEnd={(data) => onHandleOnDragEnd(data)}>
          <Droppable droppableId="basic-counter" direction="horizontal">
            {(provided) => (
              <Grid
                mt={50}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>

        <Grid mt={50}>
          <Grid.Col span={12}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <TopActiveUserCountLayout />
            </Card>
          </Grid.Col>
        </Grid>

        <Grid mt={50}>
          <Grid.Col span={12}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <MaleFemaleCountLayout />
            </Card>
          </Grid.Col>
        </Grid>

        <Grid mt={50}>
          <Grid.Col span={12}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <TopCountryCountLayout />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
