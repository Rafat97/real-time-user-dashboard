import { useState } from 'react';
import { formatDistance, subDays } from 'date-fns';
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  Skeleton,
} from '@mantine/core';
import uniqueid from 'lodash/uniqueid';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export default function TableLayout({ data, isLoading }) {
  const { classes, cx } = useStyles();

  const rowsLoading = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
    return (
      <tr key={uniqueid('UserTable_')}>
        <td>
          <Skeleton height={40} radius="md" animate={true} />
        </td>
      </tr>
    );
  });

  const rows = data.map((item) => {
    return (
      <tr key={item._id} className={cx([classes.rowSelected])}>
        <td>
          <Group spacing="sm">
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </Group>
        </td>
        <td>{item.userName}</td>
        <td>{item.email}</td>
        <td>{item.phoneNumber}</td>
        <td>
          {formatDistance(new Date(item.lastActive), new Date(), {
            addSuffix: true,
          })}
        </td>
        <td>
          {formatDistance(new Date(item.createdAt), new Date(), {
            addSuffix: true,
          })}
        </td>
      </tr>
    );
  });

  const header = isLoading ? (
    <tr>
      <th>
        <Skeleton height={40} radius="md" animate={true} />
      </th>
    </tr>
  ) : (
    <tr>
      <th>Name</th>
      <th>User Name</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>Last Active</th>
      <th>Created At</th>
    </tr>
  );

  return (
    <ScrollArea>
      <Table
        striped
        highlightOnHover
        sx={{ minWidth: 500 }}
        verticalSpacing="md"
      >
        <thead>{header}</thead>
        <tbody>{isLoading ? rowsLoading : rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
