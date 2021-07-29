import { filter, map, switchMap } from "rxjs/operators";
import { ofType, ActionsObservable, combineEpics } from "redux-observable";
import { of } from "rxjs";
import { USERS_FETCH, USERS_GET_BY_ID, USERS_PATCH } from "./constants";
import { UsersFetchAction, User } from "./types";
import {
  usersSetLoadingAction,
  usersSearchingUserLicenseAction,
  usersSetUserNotFoundAction,
  usersCloseFoundUserAction,
  usersSetUserPatchedSuccessfullyAction
} from "./actions";
import { usersUrlGET } from "./util";

const usersFetchListenerEpic = (action$: ActionsObservable<UsersFetchAction>) =>
  action$.pipe(
    ofType(USERS_FETCH),
    filter(action => !action.meta.completed && !action.error),
    map(action =>
      usersSetLoadingAction({
        url: (action.payload as any).url,
        loading: true
      })
    )
  );

const usersFetchResultEpic = (action$: ActionsObservable<UsersFetchAction>) =>
  action$.pipe(
    ofType(USERS_FETCH),
    filter(action => action.meta.completed === true || action.error === true),
    map(action => {
      const requestedUrl = usersUrlGET();

      if (action.error) {
        return usersSetLoadingAction({ url: requestedUrl, loading: false });
      }

      return usersSetLoadingAction({ url: requestedUrl, loading: false });
    })
  );

const usersGetByIdEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(USERS_GET_BY_ID),
    filter(action => action.meta.completed === true && !action.error),
    switchMap(() => {
      return of(
        usersSearchingUserLicenseAction(null),
        usersSetUserNotFoundAction(false)
      );
    })
  );

const usersGetByIdErrorEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(USERS_GET_BY_ID),
    filter(action => action.meta.completed === true && action.error),
    switchMap(() => {
      return of(
        usersSearchingUserLicenseAction(null),
        usersSetUserNotFoundAction(true)
      );
    })
  );

const usersPatchEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(USERS_PATCH),
    filter(
      action =>
        !action.meta.completed ||
        !!action.error ||
        (action.payload as User).id === undefined
    ),
    switchMap(() => {
      return of(
        usersCloseFoundUserAction(null),
        usersSetUserPatchedSuccessfullyAction(true)
      );
    })
  );

const combinedEpics = combineEpics<any>(
  usersFetchListenerEpic,
  usersFetchResultEpic,
  usersGetByIdEpic,
  usersPatchEpic,
  usersGetByIdErrorEpic
);

export { combinedEpics };
