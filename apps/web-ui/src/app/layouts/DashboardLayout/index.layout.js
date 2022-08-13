import style from './index.module.scss';
import { useState, useEffect } from 'react';
import {
  Center,
  Container,
  Grid,
  Paper,
  RingProgress,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { getTotalUserCounter } from '../../api/userCounter';

const PRIMARY_COL_HEIGHT = 300;

export default function DashboardLayout() {
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  const { isLoading, error, data } = useQuery(
    ['userCounter'],
    getTotalUserCounter,
    {
      refetchInterval: 1000,
    }
  );

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className={style.container}>
      <Container my="md">
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        >
          <Paper
            style={{ padding: '0 0 10px 0' }}
            withBorder
            height={PRIMARY_COL_HEIGHT}
          >
            <Center>
              <SimpleGrid cols={1}>
                <RingProgress
                  size={200}
                  roundCaps
                  thickness={9}
                  sections={[{ color: `green` }]}
                  label={
                    <Center>
                      <IconArrowUpRight size={22} stroke={1.5} />
                    </Center>
                  }
                />
                <Center>
                  <Text weight={700} size="xl" align="center">
                    {data.countInternationalSystem}
                  </Text>
                </Center>
                <Center>
                  <Title order={4}>Total User Count</Title>
                </Center>
              </SimpleGrid>
            </Center>
          </Paper>
          <Grid gutter="md">
            <Grid.Col>
              <Skeleton
                height={SECONDARY_COL_HEIGHT}
                radius="md"
                animate={false}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton
                height={SECONDARY_COL_HEIGHT}
                radius="md"
                animate={false}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton
                height={SECONDARY_COL_HEIGHT}
                radius="md"
                animate={false}
              />
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Container>
    </div>
  );
}
