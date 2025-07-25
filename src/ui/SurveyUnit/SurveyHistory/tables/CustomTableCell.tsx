import { TableCell, TableCellProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

type CustomCellProps = {
  noWrap?: boolean;
  cellProps?: TableCellProps;
};

export function CustomTableCell({ children, cellProps }: PropsWithChildren<CustomCellProps>) {
  return (
    <TableCell {...cellProps} sx={{ minWidth: '150px' }}>
      <Typography fontWeight={600}>{children}</Typography>
    </TableCell>
  );
}
