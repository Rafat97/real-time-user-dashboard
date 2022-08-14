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
import { IconUsers } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { getTotalUserCounter } from '../../api/userCounter';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uniqueid from 'lodash/uniqueid';
const PRIMARY_COL_HEIGHT = 300;

const UserCountLayout = ({ text, count }) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {/* <Card.Section></Card.Section> */}
      <Grid align="start">
        <Grid.Col md={6} span={3}>
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
        <Grid.Col md={6} span={3}>
          <Group position="right">
            <div>
              <Avatar size="lg" color="blue" radius="xl">
                <IconUsers size={30} />
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

  const [state, handlers] = useListState([
    {
      symbol: uniqueid('DashboardLayout_'),
      componentType: 'USER_COUNTER',
    },
    {
      symbol: uniqueid('DashboardLayout_'),
      componentType: 'USER_COUNTER',
    },
    {
      symbol: uniqueid('DashboardLayout_'),
      componentType: 'USER_COUNTER',
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
              text={`Total Users `}
              count={data?.countInternationalSystem || 0}
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
          <Droppable droppableId="dnd-draggable" direction="horizontal">
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
      </Container>
    </div>
  );
}
