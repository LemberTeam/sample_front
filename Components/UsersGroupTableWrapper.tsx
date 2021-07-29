import React, {
  useMemo,
  FunctionComponent,
  useEffect,
  useCallback
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { getLocale } from "../../../../LanguageProvider/selectors";
import localizeString from "../../../../../utils/localization/LocalizedString";
import UsersGroupTable from "./UsersGroupTable";
import useUsersGroupNamesMap from "../hooks/useUsersGroupNamesMap";
import {
  UsersGroupName,
  UsersGroupOwnerEntity,
  UsersGroupTableData,
  UsersGroupDetails
} from "../types";
import { usersGroupUsersFetchAction } from "../actions";
import useUsersGroupOwnersMap from "../hooks/useUsersGroupOwnersMap";
import {
  usersGroupsWithOwnersAndUsersSelector,
  usersGroupSearchStringSelector,
  usersGroupDataLinkingToUsersSelector
} from "../selectors";
import useUsersGroupOwnersOfTableRowMap from "../hooks/useUsersGroupOwnersOfTableRowMap";
import useUsersGroupMembershipMap from "../hooks/useUsersGroupMembershipMap";
import ApiHelper from "../../../../../utils/apiHelper";
import { USER_MANAGEMENT_LINK } from "../constants";

const UsersGroupTableWrapper: FunctionComponent = props => {
  const { history } = props;
  const [usersGroupNamesMap, isLoading] = useUsersGroupNamesMap();
  const [usersGroupOwnersMap] = useUsersGroupOwnersMap();
  const [usersGroupOwnersOfTableRowMap] = useUsersGroupOwnersOfTableRowMap();
  const [usersGroupMembershipsMap] = useUsersGroupMembershipMap();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(usersGroupUsersFetchAction());
  }, [dispatch]);
  const usersGroupNames = useMemo(() => {
    return usersGroupNamesMap.valueSeq().toJS();
  }, [usersGroupNamesMap]) as UsersGroupName[];

  const usersGroupOwners = useMemo(() => {
    return usersGroupOwnersMap.valueSeq().toJS();
  }, [usersGroupOwnersMap]) as UsersGroupOwnerEntity[];

  const usersGroupOwnersOfTableRow = useMemo(() => {
    return usersGroupOwnersOfTableRowMap.valueSeq().toJS();
  }, [usersGroupOwnersOfTableRowMap]) as UsersGroupOwnerEntity[];

  const usersGroupMemberships = useMemo(() => {
    return usersGroupMembershipsMap.valueSeq().toJS();
  }, [usersGroupMembershipsMap]) as UsersGroupOwnerEntity[];

  const usersGroups = useSelector(usersGroupsWithOwnersAndUsersSelector);
  const tableData = useMemo(() => {
    return usersGroups.valueSeq().toJS();
  }, [usersGroups]) as UsersGroupTableData[];

  const formattedData = tableData.map(td => {
    return {
      ...td,
      users: Object.keys(td.users)
        .map(v => Number(v))
        .map(key => td.users[key]),
      usersGroupOwners: Object.keys(td.usersGroupOwners)
        .map(v => Number(v))
        .map(key => td.usersGroupOwners[key])
    };
  });

  const usersGroupDataLinking = useSelector(
    usersGroupDataLinkingToUsersSelector
  );

  const searchString = useSelector(usersGroupSearchStringSelector);

  const locale = useSelector(getLocale);
  const tableTitle = useMemo(() => {
    return localizeString("User group", locale);
  }, [locale]);

  const redirectToUserManagement = useCallback(
    ({ usersGroupName, usersGroupId, userIds }: Partial<UsersGroupDetails>) => {
      if (usersGroupName && usersGroupId && userIds) {
        // eslint-disable-next-line no-restricted-globals
        history.push(
          `${ApiHelper.getParentUrl()}${USER_MANAGEMENT_LINK}?usersGroupName=${usersGroupName}&usersGroupId=${usersGroupId}&userIds=${userIds.join()}`
        );
      }
    },
    [history]
  );

  useEffect(() => {
    if (usersGroupDataLinking) {
      redirectToUserManagement(usersGroupDataLinking);
    }
  }, [usersGroupDataLinking, history, props, redirectToUserManagement]);

  return (
    <UsersGroupTable
      isLoading={isLoading}
      title={tableTitle}
      tableData={formattedData}
      usersGroupNames={usersGroupNames}
      usersGroups={usersGroups}
      usersGroupOwners={usersGroupOwners}
      usersGroupOwnersOfTableRow={usersGroupOwnersOfTableRow}
      usersGroupMemberships={usersGroupMemberships}
      searchString={searchString}
    />
  );
};

export default compose(withRouter)(UsersGroupTableWrapper);
