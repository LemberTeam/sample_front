import { Map } from "immutable";
import {
  USERS_GROUP_NAME_FETCH,
  USERS_GROUP_SET_LOADING,
  USERS_GROUP_USERS_SET_LOADING,
  USERS_OF_USERS_GROUP_FETCH,
  USERS_GROUP_POST,
  USERS_GROUP_OWNERS_FETCH,
  USERS_GROUP_FETCH,
  USERS_GROUP_OWNERS_OF_TABLE_ROW_FETCH,
  USERS_GROUP_MEMBERSHIP,
  USER_GROUP_PATCH
} from "./constants";
import { Reducer } from "./reducer";
import { NETWORKING_ACTION } from "../../../../utils/networking/networking.types";
import { ImmutableMap } from "../../../../../types";
import { User } from "../User/types";

export interface UsersGroupName {
  id: number;
  name: string;
}

export type UsersGroupNames = Map<string, ImmutableMap<UsersGroupName>>;

export type UsersGroupOwners = Map<string, ImmutableMap<UsersGroupOwnerEntity>>;

export type UsersGroupNameActions = UsersGroupNameFetchAction;

export interface UsersGroupLoadingAction {
  type: typeof USERS_GROUP_SET_LOADING;
  payload: boolean;
}
export interface UsersGroupNameFetchAction extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_NAME_FETCH;
  payload: {
    records?: Reducer["usersGroupNames"];
  };
}

export interface UsersGroupOwnersFetchAction extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_OWNERS_FETCH;
  payload: {
    records?: Reducer["usersGroupOwners"];
  };
}

export interface UsersGroupOwnersOfTableRowFetchAction
  extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_OWNERS_OF_TABLE_ROW_FETCH;
  payload: {
    records?: Reducer["usersGroupOwnersOfTableRow"];
  };
}

export interface UsersGroupMembershipFetchAction extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_MEMBERSHIP;
  payload: {
    records?: Reducer["UsersGroupMembership"];
  };
}

export interface UsersGroupMembership {
  id: number;
  userGroupId: number;
  userId: number;
  _position: number;
}

export interface UsersGroupFetchAction extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_FETCH;
  payload: {
    records?: Reducer["usersGroupNames"];
  };
}

export interface UsersGroup {
  details: ImmutableMap<UsersGroupEntity>;
  usersGroupOwners: Map<number, ImmutableMap<UsersGroupOwnerEntity>>;
  users: Map<number, ImmutableMap<User>>;
  membershipStatistics?: IDictionary<User>[] | any;
  id?: number;
}

export interface UsersGroupTableData {
  name: string;
  usersGroupOwners: UsersGroupOwnerEntity[];
  users: User[];
  id?: number;
}

export interface UsersGroupEntity {
  name: string;
  customers: string;
  id: number;
  membershipStatistics: {};
}

export interface UsersGroupOwnerEntity {
  firstName: string;
  lastName: string;
  id: number;
  username: string;
  deleteId: number;
}

export interface UsersGroupOwnerRelation {
  id: number;
  userGroupId: number;
  ownerId: number;
}

export interface UsersGroupUsersSetLoadingAction {
  type: typeof USERS_GROUP_USERS_SET_LOADING;
  payload: boolean;
}

export interface UsersGroupUsersFetchAction extends NETWORKING_ACTION {
  type: typeof USERS_OF_USERS_GROUP_FETCH;
  payload: {
    records?: Reducer["usersOfUsersGroup"];
  };
}

export interface UserGroupFetchAction extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_FETCH;
  payload: {
    records?: Reducer["usersGroups"];
  };
}

export interface MembershipDifferences {
  deleteUsersGroupOwners: number[];
  postUsersGroupOwners: number[];
  postUsers: number[];
  deleteUsers: number[];
}

export interface UsersGroupPostAction extends NETWORKING_ACTION {
  type: typeof USERS_GROUP_POST;
  payload: UsersGroupPostPayload | UsersGroup;
}

export interface UsersGroupPatchAction extends NETWORKING_ACTION {
  type: typeof USER_GROUP_PATCH;
  payload: UsersGroupPatchPayload | UsersGroup;
}

export interface UsersGroupPostPayload {
  cfg: ImmutableMap<UsersGroupEntity>;
  membershipDifferences: MembershipDifferences;
}

export interface UsersGroupPatchPayload {
  id: number;
  cfg: ImmutableMap<UsersGroupEntity>;
  membershipDifferences: MembershipDifferences;
}

export interface SelectedUsersGroup {
  selectedUsersGroup: Optional<number>;
}

export interface DeletedUserGroup {
  id: number;
  completed?: boolean;
}
