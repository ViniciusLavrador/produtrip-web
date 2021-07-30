export type PossibleUserRoles = 'USER' | 'ADMIN';

export const getUserRole = (user: any): PossibleUserRoles => {
  if (user) {
    let roles = user[Object.keys(user).filter((key) => /roles/.test(key))[0]] as string[];

    if (!roles && user && user.user_metadata) {
      roles = user.user_metadata['roles'] as string[];
    }

    if (roles && roles.includes('ADMIN')) {
      return 'ADMIN';
    }

    if (roles && roles.includes('USER')) {
      return 'USER';
    }
  }
};

export default getUserRole;
