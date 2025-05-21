export enum Role {
  USER,
  ORGANIZER,
  ADMIN
}

export const mapToRole = (role: string) => {
  switch (role) {
    case 'USER':
      return Role.USER;
    case 'ADMIN':
      return Role.ADMIN;
    case 'ORGANIZER':
      return Role.ORGANIZER;
    default:
      throw new Error(`Unknown role: ${role}`);
  }
};
