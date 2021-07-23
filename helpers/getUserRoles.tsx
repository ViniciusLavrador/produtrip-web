export interface getUserRolesProps {
  user: any;
}

export const getUserRoles = ({ user }: getUserRolesProps) => {
  if (user) {
    return user[Object.keys(user).filter((key) => /roles/)[0]] as string[];
  }
};

export default getUserRoles;
