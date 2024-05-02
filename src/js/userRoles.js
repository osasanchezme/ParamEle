const roles_map = {
  owner: {
    permissions: ["view", "make_copy", "edit", "delete", "save", "share", "transfer"],
    public: false,
  },
  admin: {
    permissions: ["view", "make_copy", "edit", "delete", "save", "share"],
    public: true,
  },
  editor: {
    permissions: ["view", "make_copy", "edit", "delete", "save"],
    public: true,
  },
  guest: {
    permissions: ["view", "make_copy"],
    public: true,
  },
};

const getRoleDescription = () => {
  // WIP - Build the description and return
};

/**
 *
 * @returns {string[]} List with all the keys of the possible roles
 */
const getAllRolesKeys = () => {
  return Object.keys(roles_map);
};

const getPublicRolesKeys = () => {
  return Object.keys(roles_map).filter((role_key) => roles_map[role_key].public);
};

export { getRoleDescription, getAllRolesKeys, getPublicRolesKeys };
