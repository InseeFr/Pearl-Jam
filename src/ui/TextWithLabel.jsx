import { Typography } from './Typography';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Box from '@mui/material/Box';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

/**
 * @param {string} label
 * @param {object} sx - cf. MUI system
 * @param {JSX.Element} children
 */
export function TextWithLabel({ label, children, sx }) {
  if (children === true) {
    children = (
      <IconWrapper>
        <CheckOutlinedIcon fontSize="small" color="green" />
      </IconWrapper>
    );
  } else if (children === false) {
    children = (
      <IconWrapper>
        <CloseOutlinedIcon fontSize="small" color="red" />
      </IconWrapper>
    );
  }
  return (
    <div>
      <Typography as="span" color="textTertiary" variant="s" sx={sx}>
        {label} :
      </Typography>
      &nbsp; &nbsp;
      <Typography as="span" color="textPrimary" variant="s" sx={sx}>
        {children || '-'}
      </Typography>
    </div>
  );
}

function IconWrapper({ children }) {
  return (
    <Box position="relative" display="inline-block">
      <Box position="absolute" sx={{ top: -15, left: -5 }}>
        {children}
      </Box>
    </Box>
  );
}
