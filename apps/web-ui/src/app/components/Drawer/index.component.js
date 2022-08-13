import { useState } from 'react';
import { Drawer, Button, Group } from '@mantine/core';

export function MDrawer() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Drawer
        position="right"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Register"
        padding="xl"
        size="xl"
      >
        {/* Drawer content */}
      </Drawer>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Drawer</Button>
      </Group>
    </>
  );
}
