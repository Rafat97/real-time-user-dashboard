/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { createStyles, Navbar, Group, Code } from '@mantine/core';
import { IconUsers, IconHome2 } from '@tabler/icons';
import {
  unstable_HistoryRouter,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { APP_ROUTERS } from '../../constent/router.const';
import { useCurrentPath } from '../../hook/useCurrentPath';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: [APP_ROUTERS.DASHBOARD_PATH], label: 'Dashboard', icon: IconHome2 },
  {
    link: [APP_ROUTERS.USER_TABLE_PATH, APP_ROUTERS.USER_INFO_EDIT_PATH],
    label: 'Users',
    icon: IconUsers,
  },
];

export function NavbarSimple() {
  const navigate = useNavigate();
  const match = useCurrentPath();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(match);

  useEffect(() => {
    setActive(match);
  }, [match]);

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.link.includes(active),
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.link[0]);
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar width={{ sm: 300 }} height={`100%`} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <h2>Logo</h2>
          <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
        </Group>
        {links}
      </Navbar.Section>
      {/*
      <Navbar.Section className={classes.footer}>
         <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
      */}
    </Navbar>
  );
}
