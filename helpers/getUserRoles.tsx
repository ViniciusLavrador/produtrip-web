export interface getUserRolesProps {
  user: any;
}

export const getUserRoles = ({ user }: getUserRolesProps) => {
  if (user) {
    return user[`${process.env.NEXT_PUBLIC_APP_DOMAIN}/roles`] as string[];
  }
};

export default getUserRoles;
