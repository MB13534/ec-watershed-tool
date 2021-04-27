export const MenuItems = [
  {
    id: 1,
    title: "Best Management Practices",
    path: "/data/inputs",
    activePath: "/data/inputs",
    exact: true,
    rolesRequired: ['Admin', 'Owner', 'Modeling Admin', 'Consultant'],
  },
  {
    id: 2,
    title: "Input Bins",
    path: "/data/input-bins",
    activePath: "/data/input-bins",
    exact: true,
    rolesRequired: ['Admin', 'Modeling Admin'],
  },
  {
    id: 3,
    title: "Input Types",
    path: "/data/input-types",
    activePath: "/data/input-types",
    exact: true,
    rolesRequired: ['Admin', 'Modeling Admin'],
  },
];
