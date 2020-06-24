import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { convertSUStateInToDo, getLastState } from 'common-tools/functions';
import { formatDistanceStrict } from 'date-fns';
import D from 'i18n';

const PageList = ({ surveyUnits, uesByPage, toggleAllSUSelection, toggleOneSUSelection }) => {
  const [page, setPage] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const history = useHistory();

  const intervalInDays = su => {
    const { collectionEndDate } = su;

    const remainingDays = formatDistanceStrict(new Date(), new Date(collectionEndDate), {
      roundingMethod: 'ceil',
      unit: 'day',
    });

    return remainingDays.split(' ')[0];
  };

  const checkSurveyUnit = su => {
    const { collectionStartDate } = su;
    const suTime = new Date(collectionStartDate).getTime();
    const instantTime = new Date().getTime();
    return suTime > instantTime;
  };

  const toggleAll = event => {
    const { target } = event;
    if (target.type !== 'checkbox') {
      event.stopPropagation();
    }
    toggleAllSUSelection(!selectAll);
    setSelectAll(!selectAll);
  };

  const toggleOne = (id, newValue) => {
    toggleOneSUSelection(id, newValue);
  };

  const filterPropagation = e => {
    const { target } = e;
    if (target.type !== 'checkbox') {
      e.stopPropagation();
    }
  };

  const renderSimpleTable = sus => {
    return (
      <table className="ue-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={e => toggleAll(e)} />
            </th>
            <th>{D.surveyHeader}</th>
            <th>{D.sampleHeader}</th>
            <th>{D.surveyUnitHeader}</th>
            <th>{D.fullNameHeader}</th>
            <th>{D.cityHeader}</th>
            <th>{D.toDoHeader}</th>
            <th>{D.remainingDaysHeader}</th>
            <th>{D.priorityHeader}</th>
            <th>{D.actionHeader}</th>
          </tr>
        </thead>
        <tbody>
          {sus.map(su => {
            const isDisabled = checkSurveyUnit(su);
            const rowClickFunct = () => {
              if (!isDisabled) history.push(`survey-unit/${su.id}`);
            };
            const inactive = isDisabled ? 'inactive' : '';
            return (
              <tr key={su.id} onClick={e => rowClickFunct(e)} className={inactive}>
                <td role="gridcell" onClick={e => filterPropagation(e)}>
                  {!isDisabled && (
                    <input
                      type="checkbox"
                      checked={su.selected || false}
                      onChange={e => toggleOne(su.id, e.target.checked)}
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                </td>
                <td>{su.campaign}</td>
                <td>{su.sampleIdentifiers.ssech}</td>
                <td>{su.id}</td>
                <td>{`${su.lastName} ${su.firstName}`}</td>
                <td>{su.address.l6}</td>
                <td>{convertSUStateInToDo(getLastState(su).type)}</td>
                <td className="align-right">{intervalInDays(su)}</td>
                <td className="align-center">
                  {su.priority && (
                    <span role="img" aria-label="priority">
                      🚩
                    </span>
                  )}
                </td>
                <td role="gridcell" className="align-center" onClick={e => e.stopPropagation()}>
                  <Link to={`/queen/questionnaire/${su.campaign}/survey-unit/${su.id}`}>
                    <span role="img" aria-label="calendar" title={D.seeSurveyUnit}>
                      📅
                    </span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderTable = ues => {
    const sortedUes = ues.sort(
      (ueA, ueB) =>
        ueA.collectionEndDate.toString().localeCompare(ueB.collectionEndDate.toString()) ||
        ueA.campaign.localeCompare(ueB.campaign) ||
        ueA.sampleIdentifiers.ssech - ueB.sampleIdentifiers.ssech
    );

    let i;
    let j;
    let ueChunk;
    const tableSize = uesByPage || 10;
    const chunkSize = tableSize;
    if (sortedUes.length <= tableSize) {
      return renderSimpleTable(sortedUes);
    }
    const ueSplit = [];
    for (i = 0, j = ues.length; i < j; i += chunkSize) {
      ueChunk = sortedUes.slice(i, i + chunkSize);
      ueSplit.push(ueChunk);
    }
    return (
      <>
        {renderSimpleTable(ueSplit[page])}
        <div className="div-nav-page">
          <button type="button" className="button-page nav" onClick={() => setPage(0)}>
            «
          </button>
          {ueSplit.map((ue, index) => (
            <button
              type="button"
              className={`button-page${index === page ? ' active' : ''}`}
              key={index}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            className="button-page nav"
            onClick={() => setPage(ueSplit.length - 1)}
          >
            »
          </button>
        </div>
      </>
    );
  };

  return <>{renderTable(surveyUnits)}</>;
};

export default PageList;
