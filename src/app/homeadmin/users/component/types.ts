export type UserRole = "Admin" | "User";

export type UserAddress = {
  id: string;
  line: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
};

export type AdminUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
  role: UserRole;
};
