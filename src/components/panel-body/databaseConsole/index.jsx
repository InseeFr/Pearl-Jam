import React from 'react';

import BackupIcon from '@material-ui/icons/Backup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Warning from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

import { PEARL_USER_KEY } from 'utils/constants';

import { db } from 'utils/indexeddb/idb-config';
import D from 'i18n';
import Dexie from 'dexie';
import download from 'downloadjs';
import { exportDB } from 'dexie-export-import';

const useStyles = makeStyles(theme => ({
  titleWrapper: {
    marginTop: '2em',
    marginBottom: '2em',
    display: 'flex',
    justifyContent: 'center',
  },
  warningIcon: {
    color: 'black',
    fontSize: '11em',
  },
  title: {
    padding: '10px 50px 10px 50px',
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: '20px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    borderRadius: '30px',
    backgroundColor: '#edc520',
  },
  subTitle: { fontSize: '4em' },
  exportBtn: {
    marginLeft: '1em',
    backgroundColor: theme.palette.success.main,
  },
  body: {
    textAlign: 'center',
  },
  actions: {
    marginTop: '2em',
  },
}));

export const DatabaseConsole = () => {
  const classes = useStyles();

  const questionnaireDataDB = new Dexie('Queen');
  questionnaireDataDB.open();

  const interviewerFromLocalStorage = window.localStorage.getItem(PEARL_USER_KEY);
  const userId = interviewerFromLocalStorage ? JSON.parse(interviewerFromLocalStorage).id : 'guest';

  const progressCallback = ({ totalRows, completedRows }) =>
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);

  const exportData = async () => {
    console.log('Exporting data from IDB');
    const timestamp = new Date().getTime();
    try {
      const blob = await exportDB(db, { prettyJson: true, progressCallback });
      download(blob, `data-export-${userId}-${timestamp}.json`, 'application/json');
    } catch (error) {
      console.log('error when exporting');
      console.error('' + error.message);
    }
  };

  const exportQuestionnaireData = async () => {
    console.log('Exporting questionnaire data from IDB');
    const timestamp = new Date().getTime();
    try {
      const blob = await exportDB(questionnaireDataDB, { prettyJson: true, progressCallback });
      download(blob, `questionnaire-data-export-${userId}-${timestamp}.json`, 'application/json');
    } catch (error) {
      console.log('error when exporting');
      console.error('' + error.message);
    }
  };

  return (
    <div>
      <div className={classes.titleWrapper}>
        <div className={classes.iconWrapper}>
          <Warning className={classes.warningIcon} />
        </div>
        <div className={classes.title}>
          {D.mainTitle.split(' ').map(v => (
            <Typography className={classes.subTitle} key={v}>
              {v}
            </Typography>
          ))}
        </div>
      </div>
      <div className={classes.body}>
        <div className={classes.actions}>
          <Button onClick={exportData} className={classes.exportBtn}>
            Export data from indexed-DB
            <BackupIcon />
          </Button>
          <Button onClick={exportQuestionnaireData} className={classes.exportBtn}>
            Export questionnaire data from indexed-DB
            <BackupIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
