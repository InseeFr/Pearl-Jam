import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Delete from '@material-ui/icons/Delete';
import Warning from '@material-ui/icons/Warning';

import Dexie from 'dexie';
import D from 'i18n';
import { unregister } from 'serviceWorkerRegistration';
import { ResetDialog } from './resetDialog';

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
  iconWrapper: {
    padding: '10px',
    borderRadius: '30px',
    backgroundColor: '#edc520',
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
  deleteBtn: {
    marginLeft: '1em',
    backgroundColor: theme.palette.error.main,
  },
  goBackBtn: {
    backgroundColor: theme.palette.success.main,
  },
  body: {
    textAlign: 'center',
  },
  actions: {
    marginTop: '2em',
  },
}));

export const ResetData = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAll = async () => {
    setOpen(false);
    setDeleteStatus('deleting');
    const deleteOneTable = async tableName => {
      await Dexie.delete(tableName);
    };
    const deleteAllContentOfCache = async cacheName => {
      await caches.delete(cacheName);
    };
    try {
      const databases = await Dexie.getDatabaseNames();
      await databases.reduce(async (previousPromise, name) => {
        await previousPromise;
        return deleteOneTable(name);
      }, Promise.resolve());
      unregister();
      const cacheNames = await caches.keys();
      await cacheNames.reduce(async (previousPromise, cacheName) => {
        await previousPromise;
        return deleteAllContentOfCache(cacheName);
      }, Promise.resolve());

      window.localStorage.clear();
      setDeleteStatus('success');
    } catch (e) {
      setDeleteStatus('failed');
    }
  };

  const goBack = () => {
    window.location = window.location.origin;
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
        {deleteStatus === 'deleting' && <Typography>{D.deleting}</Typography>}
        {deleteStatus === 'success' && <Typography>{D.deleteSuccess}</Typography>}{' '}
        {deleteStatus === 'failed' && <Typography>{D.deleteFailed}</Typography>}
        {!(deleteStatus === 'success') && <Typography>{D.youCanDeleteData}</Typography>}
        <div className={classes.actions}>
          {deleteStatus !== 'deleting' && (
            <Button onClick={goBack} className={classes.goBackBtn}>
              {D.goBackToHome}
            </Button>
          )}
          {deleteStatus !== 'success' && (
            <Button onClick={handleClickOpen} className={classes.deleteBtn} endIcon={<Delete />}>
              {D.deleteAll}
            </Button>
          )}
        </div>
      </div>
      <ResetDialog
        open={open}
        title={`${D.deleteAll} ?`}
        agree={D.yesDeleteAll}
        disagree={D.noImNotSure}
        agreeFunction={deleteAll}
        disagreeFunction={handleClose}
        body={D.firstBodyDialog}
      />
    </div>
  );
};
