export type Asset = {
  id?: string;
  name?: string;
  url?: string;
  mimetype?: string;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  user?: User;
};
export type User = {
  id?: string;
  nickname?: string;
  email?: string;
  password?: string;
  socialId?: string;
  socialType?: "KAKAO" | "GOOGLE" | "NAVER" | "APPLE";
  role?:
    | "DESIGNATED"
    | "SHUTTLE"
    | "MEDIATION"
    | "MANAGER"
    | "SYSTEM"
    | "CUSTOMER";
  socketId?: string;
  apiKey?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  companyId?: string;
  profile?: UserProfile;
  representativeCompany?: Company;
  company?: Company;
  notices?: Notice[];
  noticeComments?: NoticeComment[];
  updatedNotices?: Notice[];
  updatedCompany?: Company[];
  terms?: UserAuthTerm[];
  insuranceCompanies?: InsuranceCompany[];
  userInsuranceCompanies?: UserInsuranceCompany[];
  designatedUserStatuses?: DesignatedUserStatus[];
  designatedLocations?: DesignatedUserLocation[];
  incomes?: DesignatedUserIncome[];
  shuttleBusReservations?: ShuttleBusReservation[];
  cashes?: UserCash[];
  Asset?: Asset[];
};
export type UserProfile = {
  id?: string;
  name?: string;
  nameEn?: string;
  phoneNumber?: string;
  birthdate?: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  carNumber?: string;
  businessNumber?: string;
  administrativeDivision?: string;
  licenseType?: "Big1" | "Normal1" | "Normal2";
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  user?: User;
};
export type UserCash = {
  id?: string;
  userId?: string;
  cash?: number;
  type?: "CHARGE" | "CONSUME" | "DEPOSIT" | "WITHDRAW";
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user?: User;
  shuttleBusReservation?: ShuttleBusReservation;
};
export type AuthTerm = {
  id?: string;
  name?: string;
  description?: string;
  order?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  users?: UserAuthTerm[];
};
export type UserAuthTerm = {
  userId?: string;
  termId?: string;
  user?: User;
  term?: AuthTerm;
};
export type DesignatedUserStatus = {
  id?: string;
  userId?: string;
  startedAt?: Date | string;
  endedAt?: Date | string;
  createdAt?: Date | string;
  user?: User;
};
export type DesignatedUserLocation = {
  id?: string;
  userId?: string;
  gpsUTC?: Date | string;
  status?: string;
  createdAt?: Date | string;
  user?: User;
};
export type DesignatedUserIncome = {
  id?: string;
  userId?: string;
  income?: number;
  spend?: number;
  drivingStartAt?: Date | string;
  drivingEndAt?: Date | string;
  createdAt?: Date | string;
  user?: User;
};
export type Company = {
  id?: string;
  name?: string;
  businessNumber?: string;
  telephone?: string;
  address?: string;
  representativeName?: string;
  representativePhoneNumber?: string;
  representativeId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  updatedUserId?: string;
  representative?: User;
  users?: User[];
  updatedUser?: User;
};
export type InsuranceCompany = {
  id?: string;
  name?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  userId?: string;
  users?: UserInsuranceCompany[];
  User?: User;
};
export type UserInsuranceCompany = {
  userId?: string;
  insuranceCompanyId?: string;
  personCost?: number;
  productCost?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  user?: User;
  insuranceCompany?: InsuranceCompany;
};
export type Cooperative = {
  id?: string;
  name?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
};
export type Mobility = {
  id?: string;
  type?: "STAREX" | "STARIA";
  carNumber?: string;
  shuttleNumber?: string;
  ownerName?: string;
  ownerPhoneNumber?: string;
  passengerMaxCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  tablet?: Tablet;
};
export type Tablet = {
  id?: string;
  password?: string;
  routeCode?: string;
  appVersion?: string;
  lastLoginedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  mobilityId?: string;
  mobility?: Mobility;
};
export type ShuttleBusRouteGroup = {
  id?: string;
  name?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  trees?: ShuttleBusRouteTree[];
  reservations?: ShuttleBusReservation[];
};
export type ShuttleBusRoute = {
  id?: string;
  name?: string;
  comment?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  trees?: ShuttleBusRouteTree[];
};
export type ShuttleBusRouteTree = {
  id?: string;
  groupId?: string;
  routeId?: string;
  price?: number;
  order?: number;
  departureTime?: Date | string;
  arrivalTime?: Date | string;
  endTime?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  group?: ShuttleBusRouteGroup;
  route?: ShuttleBusRoute;
  departureReservations?: ShuttleBusReservation[];
  arrivalReservations?: ShuttleBusReservation[];
};
export type ShuttleBusReservation = {
  id?: string;
  userId?: string;
  routeGroupId?: string;
  departureTreeId?: string;
  arrivalTreeId?: string;
  userCashId?: string;
  cash?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user?: User;
  routeGroup?: ShuttleBusRouteGroup;
  departureTree?: ShuttleBusRouteTree;
  arrivalTree?: ShuttleBusRouteTree;
  userCash?: UserCash;
};
export type Notice = {
  id?: string;
  order?: number;
  type?: "NORMAL" | "EMERGENCY";
  title?: string;
  content?: string;
  views?: number;
  startedAt?: Date | string;
  endedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  createdUserId?: string;
  updatedUserId?: string;
  createdUser?: User;
  updatedUser?: User;
  comments?: NoticeComment[];
};
export type NoticeComment = {
  id?: string;
  content?: string;
  userId?: string;
  noticeId?: string;
  parentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  user?: User;
  notice?: Notice;
  parent?: NoticeComment;
  children?: NoticeComment[];
};
export type Device = {
  id?: string;
  hwVersion?: string;
  fwVersion?: string;
  phone?: string;
  totalRunningTime?: number;
  totalRunningCount?: number;
  lastConnectedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  headers?: DeviceHeader[];
  positions?: DevicePosition[];
};
export type DeviceHeader = {
  id?: string;
  deviceId?: string;
  createdAt?: Date | string;
  device?: Device;
};
export type DevicePosition = {
  id?: string;
  deviceId?: string;
  satelliteCount?: number;
  number?: number;
  createdAt?: Date | string;
  device?: Device;
};
