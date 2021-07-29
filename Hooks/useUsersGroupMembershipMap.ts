import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Map } from "immutable";
import { usersGroupMembershipFetchAction } from "../actions";
import {
  usersGroupMembershipSelector,
  usersGroupIsLoadingSelector
} from "../selectors";
import { UsersGroupMembership } from "../types";
import { ImmutableMap } from "../../../../../../types";

const useUsersGroupMembershipMap = (): [
  Map<number, ImmutableMap<UsersGroupMembership>>,
  boolean
] => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(usersGroupMembershipFetchAction());
  }, [dispatch]);

  const usersGroupMembership = useSelector(usersGroupMembershipSelector);
  const isLoading = useSelector(usersGroupIsLoadingSelector);
  return [usersGroupMembership, isLoading];
};

export default useUsersGroupMembershipMap;
