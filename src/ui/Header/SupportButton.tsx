import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import React from 'react';
import D from '../../i18n/build-dictionary';
import { downloadSupportFile } from '../../utils/support';

export const SupportButton: React.FC = () =>
  <Button
    onClick={downloadSupportFile}
    color="textPrimary"
    sx={{ textDecoration: 'none' }}
    startIcon={<DownloadIcon fontSize="small" />}
  >
    {D.downloadSupportFile}
  </Button>
  ;
