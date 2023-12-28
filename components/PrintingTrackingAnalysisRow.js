import { Select, MenuItem, Avatar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InfoModal from 'components/InfoModal';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'white',
    color: 'black',
    padding: '5px 10px',
    fontSize: '1vw',
    fontWeight: 200,
    width: '2vw'
  },
  root1: {
    backgroundColor: 'white',
    color: 'black',
    padding: '5px 10px',
    fontSize: '1vw',
    fontWeight: 200,
    // width: '2vw'
  },

  td1: {
    backgroundColor: '#69E866',
    width: '3vw'
  },
  td3: {
    outline: '2px solid transparent',
    width: '100%',
    background: 'white'
  },
  td4: {
    outline: '2px solid #6B4EFF',
    maxWidth: '8vw'
  },
  td4Inactive: {
    outline: '2px solid transparent',
    width: '12vw'
    // maxWidth: '5vw'
  },
  avatar: {
    height: '40px',
    width: '40px',
    backgroundColor: '#00A86B',
    margin: '0px',
    padding: '0px',
    marginLeft: '10px',
    cursor: 'pointer'
  },
  avatarDisabled: {
    height: '40px',
    width: '40px',
    backgroundColor: '#778899',
    margin: '0px',
    padding: '0px',
    marginLeft: '10px',
    cursor: 'pointer'
  },
  td5: {
    width: '4vw',
    display: 'flex',
    height: '40px',
    maxHeight: '40px',
    margin: '0px',
    padding: '0px',
    backgroundColor: 'transparent'
  },
  td6: {
    outline: '2px solid #6B4EFF'
  },
  addBagInput: {
    width: '4vw',
    fontSize: '20px',
    padding: '10px'
  },
  transpatentBorder: {
    outline: '2px solid black',
    width: '10vw'
  },
  td7: {
    outline: '2px solid black',
    // maxWidth: '8vw',
    // width: '10vh'
    width: '8vw'
  },
  td10: {
    width: '8vw'
  },
  td11: {
    width: '10vw'
  }
}));

function PrintingTrackingAnalysisRow({
  data,
  // BAG_TYPES,
  handleNewShipment,
  index,
  handleBagDone,
  // handleBagIncrement,
  handleBeltReset,
  enablePrintingPlc
}) {
  const classes = useStyles();
  const [bagType, setBagType] = useState('');
  const [bagCount, setBagCount] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    await handleNewShipment({
      printingId: data?.id,
      bag_limit: Number(bagCount),
    });
  };

  const handleReset = async e => {
    setBagCount(0)
    handleBagDone(data?.id)
  }

  const handleValueChange = (e, setterFunction) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setterFunction(e.target.value);
    }
  };

  return (
    <>
      <tr className="custom-table">
        <td className={classes.td1}>{index}</td>
        <td
          className={classes.td11}
          style={{
            background: data?.shipment_id
              ? (data?.is_shipment_complete ? 'yellow' : (data?.is_belt_running ? "green" : "red")) 
              : 'white'
          }}
        >
          {data?.id}
        </td>
        <td className={data?.shipment_id ? classes.td7 : classes.td4Inactive}>
          {data?.tag_count}
        </td>
        <td className={data?.shipment_id ? classes.td7 : classes.td4Inactive}>
          {data?.missed_label_count}
        </td>
        <td className={data?.shipment_id ? classes.td7 : classes.td4Inactive}>
          {data?.shipment_id ? (
            data?.bag_limit
          ) : (
            <input
              style={{ width: '8vw', padding: '10px', textAlign: 'center' }}
              placeholder={enablePrintingPlc ? "Target" : ""}
              value={data?.shipment_id ? bagCount : null}
              disabled={data?.shipment_id || !enablePrintingPlc}
              onChange={e => handleValueChange(e, setBagCount)}
            />
          )}
        </td>
        <td className={data?.shipment_id ? classes.td7 : classes.td4Inactive}>
          {data?.shipment_id ? data?.bag_count : '-'}
        </td>
        <td>
          {data?.shipment_id ? (
            <Button className={classes.root1} onClick={handleReset}>
              RESET
            </Button>
          ) : (
            <Button
              disabled={bagCount === '' || bagCount === 0 || bagCount === '0' || bagCount === null}
              className={classes.root}
              onClick={handleSubmit}
            >
              START
            </Button>
          )}
        </td>
        <td>
          <Button
            className={classes.root1}
            disabled={!data.shipment_id || data.is_belt_running}
            onClick={() =>
              setDetailModalOpen({
                issue_with_belt: data?.issue_with_belt,
                belt_id: data?.id,
                transaction_id: data?.shipment_id
              })
            }
          >
            VIEW
          </Button>
        </td>
      </tr>
      {detailModalOpen ? (
        <InfoModal
          open={detailModalOpen}
          close={() => setDetailModalOpen(null)}
          hideComment
          hideModify
          jamReset
          title="Belt Stopped"
          handleBeltReset={handleBeltReset}
        >
          <>
            <p style={{ textAlign: 'center' }}>
              {detailModalOpen?.issue_with_belt} -{detailModalOpen?.belt_id}
            </p>
          </>
        </InfoModal>
      ) : null}
    </>
  );
}

export default PrintingTrackingAnalysisRow;
