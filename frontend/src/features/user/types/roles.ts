export enum Role {
  User = 'USER',
  Organizer = 'ORGANIZER',
  Admin = 'ADMIN'
}

export const mapToRole = (role: string) => {
  switch (role) {
    case 'USER':
      return Role.User;
    case 'ADMIN':
      return Role.Admin;
    case 'ORGANIZER':
      return Role.Organizer;
    default:
      throw new Error(`Unknown role: ${role}`);
  }
};
