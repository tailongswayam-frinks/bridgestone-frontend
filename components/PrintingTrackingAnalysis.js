import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'context/GlobalContext';
import { setLocalStorage, getLocalStorage } from 'utils/storage';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { get, post, put } from 'utils/api';
import LoaderAnalysisRow from './LoaderAnalysisRow';
import PrintingTrackingAnalysisRow from './PrintingTrackingAnalysisRow';

// Define styles using makeStyles
const useStyles = makeStyles(() => ({
  rackContainer: {
    marginTop: '120px',
    marginLeft: '80px',
    fontSize: '24px',
    fontWeight: '800'
  },
  rackContainer1: {
    marginTop: '120px',
    marginLeft: '80px',
    fontSize: '24px',
    fontWeight: '800',
    height: '20px'
  },
  inputRackNo: {
    marginTop: '20px',
    height: '30px',
    fontSize: '20px',
    marginRight: '10px',
    marginLeft: '5px',
    borderRadius: '6px',
    width: '130px',
    border: 'none',
    padding: '0 10px'
  },
  rackButton: {
    backgroundColor: '#008847',
    fontSize: '20px',
    borderRadius: '6px',
    // padding: '2px 9px',
    fontWeight: '700',
    border: 'none',
    height: '30px'
  },
  editRackButton: {
    backgroundColor: '#69E866',
    fontSize: '20px',
    borderRadius: '6px',
    // padding: '2px 9px',
    fontWeight: '700',
    border: 'none',
    height: '30px'
  },
  tableContainer: {
    marginTop: '140px'
    // marginLeft: '80px',
    // fontSize: '24px',
    // fontWeight: '800'
  },
  tableDiv: {
    // padding: '0px',
    paddingBottom: '30px'
  }
}));

function PrintingShipmentAnalysis({
  vehicleType,
  printingBelts,
  handleNewPrintingShipment,
  handleFlag,
  handleBagDone,
  handleBagIncrement,
  handleBeltReset,
  enablePrintingPlc
}) {
  const classes = useStyles();
  const { bagTypes: BAG_TYPES } = useContext(GlobalContext);
  const [filterButton, setFilterButton] = useState(2);
  const [filterPrinter, setFilterPrinter] = useState();

  useEffect(() => {
    setFilterButton(vehicleType);
  }, [vehicleType]);

  useEffect(() => {
    const filteredPrinters = {};
    if (printingBelts) {
      Object.values(printingBelts).forEach(element => {
        filteredPrinters[element.id] = element;
      });
      setFilterPrinter(filteredPrinters);
    }
  }, [printingBelts, filterButton]);

  return (
    <>
      {<div className={classes.rackContainer1} />}
      <div className={classes.tableDiv}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>PRINTING BELT NUMBER</th>
              <th>TOTAL COUNT</th>
              <th>TOTAL REJECT COUNT</th>
              <th>TARGET</th>
              <th>ACTUAL</th>
              <th>SET</th>
              <th>VIEW</th>
            </tr>
          </thead>
          <tbody>
            {filterPrinter &&
              Object.values(filterPrinter).map((e, index) => (
                <PrintingTrackingAnalysisRow
                  key={index}
                  data={e}
                  // BAG_TYPES={BAG_TYPES}
                  handleNewShipment={arg => handleNewPrintingShipment(arg)}
                  handleFlag={handleFlag}
                  index={index + 1}
                  handleBagDone={handleBagDone}
                  // handleBagIncrement={handleBagIncrement}
                  handleBeltReset={handleBeltReset}
                  enablePrintingPlc={enablePrintingPlc}
                />
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PrintingShipmentAnalysis;
