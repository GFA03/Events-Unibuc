import {Role} from "@/types/user/roles";

export class User {
    public readonly id: string;
    public readonly email: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly role: Role;
    public readonly phoneNumber: string;
    public readonly createdAt: string;
    public readonly updatedAt: string;

    private constructor(
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        role: Role,
        phoneNumber: string,
        createdAt: string,
        updatedAt: string
    ) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static fromDto(dto: UserDto): User {
        const roleMap: Record<string, Role> = {
            ADMIN: Role.ADMIN,
            ORGANIZER: Role.ORGANIZER,
            USER: Role.USER,
        };

        const roleEnum = roleMap[dto.role.toUpperCase()];
        if (roleEnum === undefined) {
            throw new Error(`Unknown role: ${dto.role}`);
        }

        return new User(
            dto.id,
            dto.email,
            dto.firstName,
            dto.lastName,
            roleEnum,
            dto.phoneNumber,
            dto.createdAt,
            dto.updatedAt
        );
    }
}