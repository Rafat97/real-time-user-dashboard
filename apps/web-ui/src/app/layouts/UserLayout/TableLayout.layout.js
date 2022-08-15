import { formatDistance } from 'date-fns';
import {
  createStyles,
  Table,
  ScrollArea,
  Group,
  Avatar,
  Text,
  Skeleton,
} from '@mantine/core';
import uniqueId from 'lodash/uniqueId';
import { IconActivity, IconArchive, IconEdit } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export default function TableLayout({
  data,
  isLoading,
  onClickDelete,
  onClickActivity,
  onClickEdit,
}) {
  const { classes, cx } = useStyles();

  const rowsLoading = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
    return (
      <tr key={uniqueId('UserTable_')}>
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
        <td>{item.gender}</td>
        <td>{item.country}</td>
        <td>
          {formatDistance(new Date(item.lastActive), new Date(), {
            addSuffix: true,
          })}
        </td>
        <td>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => onClickEdit(item._id)}
          >
            <IconEdit size={24} />
          </div>
        </td>
        <td>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => onClickDelete(item._id)}
          >
            <IconArchive size={24} />
          </div>
        </td>
        <td>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => onClickActivity(item._id)}
          >
            <IconActivity size={24} />
          </div>
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
      <th>Gender</th>
      <th>Country</th>
      <th>Last Active</th>
      <th></th>
      <th></th>
      <th></th>
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
