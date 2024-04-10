import { toDoEnum } from '../utils/enum/SUToDoEnum';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';


/**
 * @param {keyof typeof toDoEnum} status
 * @return {JSX.Element}
 */
export function StatusChip({ status }) {
  const theme = useTheme();
  const className = status.color === 'primary' ? 'MuiChip-colorPrimary' : 'MuiChip-colorDefault';
  return (
    <Chip
      sx={{
        backgroundColor: status.color,
        height: 28,
        color: theme.palette.textPrimary.main,
        fontWeight: '600',
      }}
      label={status.value}
      className={className}
    />
  );
}

StatusChip.propTypes = {
  status: PropTypes.shape({
    color: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};