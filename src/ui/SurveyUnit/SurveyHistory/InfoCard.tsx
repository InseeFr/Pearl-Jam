import { Card, CardContent, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Row } from 'ui/Row';

type InfoCardProps = {
  icon?: JSX.Element;
  children?: ReactNode;
};

export function InfoCard({ children }: PropsWithChildren<InfoCardProps>) {
  return (
    <Card elevation={0} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Stack gap={3}>
          <Row justifyContent="space-between">
            <Row gap={1}>{children}</Row>
          </Row>
        </Stack>
      </CardContent>
    </Card>
  );
}
