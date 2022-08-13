import {
  RingProgress,
  Text,
  SimpleGrid,
  Paper,
  Center,
  Group,
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export function StatsRing({ data }) {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder height={300} key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={22} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });
  return (
    <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      {stats}
    </SimpleGrid>
  );
}
