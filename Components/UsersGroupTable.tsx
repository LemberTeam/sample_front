import React, { FunctionComponent, useMemo, useCallback } from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { useDispatch } from "react-redux";
import LoadingIndicator from "../../../../../components/LoadingIndicator/LoadingIndicator";
import { UsersGroupTableOptions } from "./UsersGroupTableOptions";
import { UsersGroupTableColumnSettings } from "./UsersGroupTableColumnSettings";
import { UsersGroupTableData } from "../types";
import { compose } from "../../../../../utils/functions";
import { withErrorBoundary } from "../../../../App/withErrorBoundary";
import {
  usersGroupSetSelectedIdAction,
  usersGroupIsEditingUserInRowAction,
  usersGroupSetAddAction,
  usersGroupSetUserLinkAction
} from "../actions";

interface Props extends InjectedIntlProps {
  tableData: UsersGroupTableData[];
  title: string;
  isLoading: boolean;
  searchString: string;
}

const LoadingIndicatorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: stretch;
  align-items: center;
  position: static;
`;

const StyledLoadingIndicator = styled(LoadingIndicator)`
  && {
    z-index: 1200;
  }
`;

const UsersGroupTable: FunctionComponent<Props> = ({
  tableData,
  title,
  isLoading,
  searchString,
  intl
}) => {
  const options: MUIDataTableOptions = useMemo(
    () => UsersGroupTableOptions(intl),
    [intl]
  );

  const dispatch = useDispatch();
  const patchUsersGroup = useCallback(
    (id: number) => {
      dispatch(usersGroupSetSelectedIdAction(id));
      dispatch(usersGroupIsEditingUserInRowAction(true));
      dispatch(usersGroupSetAddAction(false));
    },
    [dispatch]
  );

  const openUsers = useCallback(
    id => {
      dispatch(usersGroupSetSelectedIdAction(id));
      dispatch(usersGroupSetUserLinkAction(true));
    },
    [dispatch]
  );

  const columns = useMemo(
    () => UsersGroupTableColumnSettings(patchUsersGroup, openUsers, intl) ?? [],
    [intl, openUsers, patchUsersGroup]
  );

  const rows = useMemo(() => {
    return tableData
      .filter(row => {
        if (searchString) {
          const isNameMatch = row.name
            .toLowerCase()
            .includes(searchString.toLowerCase());

          let isUsersGroupOwnersMatch = false;
          row.usersGroupOwners.forEach(item => {
            isUsersGroupOwnersMatch =
              isUsersGroupOwnersMatch ||
              item.firstName
                .toLowerCase()
                .includes(searchString.toLowerCase()) ||
              item.lastName.toLowerCase().includes(searchString.toLowerCase());
          });
          return isNameMatch || isUsersGroupOwnersMatch;
        }
        return true;
      })
      .map(row => {
        return {
          id: row.id,
          name: row.name,
          users: row.users,
          usersGroupOwners: row.usersGroupOwners
        };
      })
      .filter(item => !!item);
  }, [searchString, tableData]);

  if (isLoading !== false) {
    return (
      <Box height="100%" width="100%">
        <LoadingIndicatorContainer>
          <StyledLoadingIndicator position="absolute" />
        </LoadingIndicatorContainer>
      </Box>
    );
  }

  return (
    <Box height="100%" width="100%">
      <MUIDataTable
        title={title}
        data={rows}
        columns={columns}
        options={options}
      />
    </Box>
  );
};

export default compose(withErrorBoundary, injectIntl)(UsersGroupTable);
