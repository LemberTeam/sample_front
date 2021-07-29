import { Map } from "immutable";
import {
  User,
  UsersFetchAction,
  UsersSetLoadingAction,
  UsersPatchAction,
  UsersPatchPayload,
  UsersSetSelectedGroupDetails
} from "./types";
import {
  USERS_FETCH,
  USERS_SET_LOADING,
  USERS_SHOW_ONLY_ACTIVE_SET,
  USERS_SEARCH_STRING,
  USERS_PATCH,
  USERS_SEARCH_LICENSE,
  USERS_GET_BY_ID,
  USERS_NOT_FOUND,
  USERS_CLOSE_FOUND_STATE,
  USERS_IS_EDIT_IN_ROW,
  USERS_SET_USER_PATCHED_SUCCESS,
  USERS_SET_USER_GROUP_DETAILS
} from "./constants";
import { networkingAction } from "../../../../utils/networking/networking.actioncreators";
import { NETWORKING_ACTION_PAGING_CONFIG } from "../../../../utils/networking/networking.types";
import { Reducer } from "./reducer";
import { pagingExtractItems, usersUrlGET, userGetbyIdURL } from "./util";
import { ImmutableMap } from "../../../../../types";
import ApiHelper from "../../../../utils/apiHelper";

const usersPagingConfig = (
  url: string,
  path: string,
  actionPayload: UsersFetchAction["payload"]
): NETWORKING_ACTION_PAGING_CONFIG<
  IResponseWrapper<User>,
  Reducer["users"],
  Map<string, ImmutableMap<User>>
> => ({
  extractItems: pagingExtractItems(path),
  pageLimit: 100,
  startOffset: 0,
  url,
  emissionFunction: users =>
    ({
      ...actionPayload,
      records: users.reduce((acc, val) => {
        const user = Map(val) as ImmutableMap<User>;
        return acc.set(String(user.get("id")), user);
      }, Map() as Map<string, ImmutableMap<User>>)
    } as any)
});

const usersSetLoadingAction = (
  payload: UsersSetLoadingAction["payload"]
): UsersSetLoadingAction => ({
  type: USERS_SET_LOADING,
  payload
});

const usersFetchAction = (): UsersFetchAction =>
  networkingAction({
    type: USERS_FETCH,
    payload: usersPagingConfig(usersUrlGET(), "user", {}),
    meta: {
      paging: true
    }
  }) as UsersFetchAction;

const userPatchAction = (payload: UsersPatchAction["payload"]) =>
  networkingAction({
    type: USERS_PATCH,
    payload,
    meta: {
      observable: usersPatchObservable(payload as UsersPatchPayload)
    }
  });

const usersPatchObservable = (payload: UsersPatchPayload) =>
  ApiHelper.patch(
    `/user/${payload.ids.join(",")}`,
    { data: payload.cfg },
    true,
    true
  );

const userGetByIdAction = (payload: string) =>
  networkingAction({
    type: USERS_GET_BY_ID,
    payload,
    meta: {
      observable: ApiHelper.get(
        userGetbyIdURL(payload),
        undefined,
        undefined,
        true
      )
    }
  });
const usersSearchingUserLicenseAction = (payload: any) => ({
  type: USERS_SEARCH_LICENSE,
  payload
});

const usersShowOnlyActiveSetAction = (payload: boolean) => ({
  type: USERS_SHOW_ONLY_ACTIVE_SET,
  payload
});

const usersSetSearchStringAction = (payload: string) => ({
  type: USERS_SEARCH_STRING,
  payload
});

const usersSetPatchingStateAction = (payload: boolean) => ({
  type: USERS_PATCH,
  payload
});

const usersSetSearchingStateAction = (payload: boolean) => ({
  type: USERS_SEARCH_LICENSE,
  payload
});

const usersSetUserNotFoundAction = (payload: boolean) => ({
  type: USERS_NOT_FOUND,
  payload
});

const usersCloseFoundUserAction = (payload: any) => ({
  type: USERS_CLOSE_FOUND_STATE,
  payload
});

const usersIsEditingUserInRow = (payload: boolean) => ({
  type: USERS_IS_EDIT_IN_ROW,
  payload
});

const usersSetUserPatchedSuccessfullyAction = (payload: boolean) => ({
  type: USERS_SET_USER_PATCHED_SUCCESS,
  payload
});

const usersSetSelectedGroupDetailsAction = (
  payload: UsersSetSelectedGroupDetails["payload"]
) => ({
  type: USERS_SET_USER_GROUP_DETAILS,
  payload
});

export {
  usersFetchAction,
  usersSetLoadingAction,
  usersShowOnlyActiveSetAction,
  usersSetSearchStringAction,
  userPatchAction,
  usersSetPatchingStateAction,
  usersSetSearchingStateAction,
  userGetByIdAction,
  usersSetUserNotFoundAction,
  usersCloseFoundUserAction,
  usersSearchingUserLicenseAction,
  usersIsEditingUserInRow,
  usersSetUserPatchedSuccessfullyAction,
  usersSetSelectedGroupDetailsAction
};
