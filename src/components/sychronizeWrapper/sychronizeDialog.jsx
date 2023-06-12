import { ExpandMore, ThumbUpAlt } from '@material-ui/icons';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import D from 'i18n';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import MaterialIcons from 'utils/icons/materialIcons';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    borderRadius: '15px',
  },
  title: {
    '& *': {
      fontSize: '1.4em',
    },
  },
  subTitle: {
    '& span': {
      fontWeight: 'bold',
      marginLeft: '1em',
      alignSelf: 'center',
    },
    display: 'flex',
    marginBottom: '1.5em',
  },
  content: {
    '& span': {
      alignSelf: 'center',
    },

    display: 'flex',
  },
  noVisibleFocus: {
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  positive: { marginLeft: '0.5em', color: theme.palette.success.main },
  details: {
    marginTop: '2em',
    //boxShadow: '3px 0 0.8em grey, -3px 0 0.8em grey',
  },
  detailsContent: { display: 'block' },
}));

export const SyncDialog = ({ close, syncResult }) => {
  const { state, date, messages, details } = syncResult;

  const { transmittedSurveyUnits, loadedSurveyUnits } = details || {};

  const getdetailsMessagesByCampaign = () => {
    const transmittedCampaigns = Object.keys(transmittedSurveyUnits || {});
    const loadedCampaigns = Object.keys(loadedSurveyUnits || {});
    const allCampaigns = transmittedCampaigns.reduce((_, c) => {
      if (!loadedCampaigns.includes(c)) return [..._, c];
      return _;
    }, loadedCampaigns);
    return allCampaigns.reduce((_, c) => {
      const transNB = (transmittedSurveyUnits[c] || []).length;
      const loadNB = (loadedSurveyUnits[c] || []).length;
      const transmittedMessage = transNB > 0 ? D.transmittedSurveyUnits(transNB) : null;
      const loadedMessage = loadNB > 0 ? D.loadedSurveyUnits(loadNB) : null;
      if (transmittedMessage || loadedMessage)
        return [..._, { campaign: c, transmittedMessage, loadedMessage }];
      return _;
    }, []);
  };

  const detailsMessage = getdetailsMessagesByCampaign();

  const classes = useStyles();
  return (
    <Dialog
      maxWidth="md"
      className={classes.syncResult}
      open={!!syncResult}
      onClose={close}
      PaperProps={{ className: classes.dialogPaper }}
    >
      <DialogTitle className={classes.title} color={state === 'error' ? 'error' : 'initial'}>
        <Typography>{D.syncResult}</Typography>
      </DialogTitle>
      <Divider />

      <DialogContent>
        {state && (
          <DialogContentText className={classes.subTitle}>
            <MaterialIcons type={state} />
            <span>{D.titleSync(state)}</span>
            {date && <span>{`(${date})`}</span>}
          </DialogContentText>
        )}
        {messages?.map((message, index) => (
          <DialogContentText key={index} className={classes.content}>
            <span>{message}</span>
            {state === 'warning' && index === messages.length - 1 && (
              <ThumbUpAlt className={classes.positive} />
            )}
          </DialogContentText>
        ))}

        {state !== 'error' && (
          <Accordion className={classes.details}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{D.detailsSync}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.detailsContent}>
              {detailsMessage.length === 0 && <Typography>{D.nothingToDisplay}</Typography>}
              {detailsMessage.map(({ campaign, transmittedMessage, loadedMessage }) => (
                <React.Fragment key={campaign}>
                  {transmittedMessage && (
                    <Typography>
                      <b>{`${campaign.toLocaleLowerCase()} : `}</b>
                      {transmittedMessage}
                    </Typography>
                  )}
                  {loadedMessage && (
                    <Typography>
                      <b>{`${campaign.toLocaleLowerCase()} : `}</b>
                      {loadedMessage}
                    </Typography>
                  )}
                </React.Fragment>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{D.iUnderstand}</Button>
      </DialogActions>
    </Dialog>
  );
};
