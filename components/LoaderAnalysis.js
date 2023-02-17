import { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import AnalyticsCard from 'components/AnalyticsCard';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import PropTypes from 'prop-types';
import AddMoreBagsModal from 'components/AddMoreBagsModal';
import DefectiveBags from 'components/DefectiveBags';
import InfoModal from 'components/InfoModal';
import FilterButton from './FilterButton';

const LoaderAnalysis = ({
  vehicleBelts,
  handleBagIncrement,
  ongoingTransactions,
  setReverseShipmentFormOpen,
  handleBagDone
}) => {
  const [detailModalOpen, setDetailModalOpen] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(null);
  const [bagModifyModalOpen, setBagModifyModalOpen] = useState(null);
  const [filterButton, setFilterButton] = useState(2);
  const [filterVehicle, setFiltervehicle] = useState();
  
  useEffect(() => {
    if (filterButton === 2) {
      setFiltervehicle(vehicleBelts)
    }
    else {
      setFiltervehicle(vehicleBelts && vehicleBelts.length !== 0 ?(vehicleBelts.filter(vehicle=>vehicle.vehicle_type===filterButton)):null)
    }
    
  }, [vehicleBelts?.length, filterButton]);
  


  return (
    <>
      <div className="analysis-container">
        <div className="head">
          <h2>Loader Analysis</h2>
          <div className="search-container"></div>
        </div>
        <div className="analytics">
          <div className="shipment-type">
            <div
              style={{
                background: '#01ba8f',
                height: '18px',
                width: '18px',
                borderRadius: '100px',
                border: '2px solid #f5f5f5',
                marginRight: '4px'
              }}
            />
            <span className="category-name">Active Loader</span>
            <hr />
          </div>
          {ongoingTransactions &&
          Object.keys(ongoingTransactions)?.length === 0 ? (
            <p
              style={{
                fontSize: '20px',
                textAlign: 'center',
                color: 'gray'
              }}
            >
              <AiOutlineExclamationCircle style={{ fontSize: '70px' }} />
              <br />
              No shipment created.
              <br />
              Please create a shipment first.
            </p>
          ) : (
            <Grid
              container
              spacing={2}
              style={{
                backgroundColor: '#4DA76638',
                padding: '20px 10px 0',
                borderRadius: '10px'
              }}
            >
              {' '}
              {ongoingTransactions &&
                Object.keys(ongoingTransactions)?.map((e, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={index}
                    style={{ marginBottom: '20px' }}
                  >
                    <AnalyticsCard
                      data={{
                        ...ongoingTransactions[e]
                      }}
                      rejectModalOpen={() =>
                        setRejectModalOpen(ongoingTransactions[e])
                      }
                      setDetailModalOpen={() =>
                        setDetailModalOpen(ongoingTransactions[e])
                      }
                      bagModifyModalOpen={() =>
                        setBagModifyModalOpen(ongoingTransactions[e])
                      }
                      handleBagDone={handleBagDone}
                      loaderCard
                      status={0}
                    />
                  </Grid>
                ))}{' '}
            </Grid>
          )}
          <div className="shipment-type" style={{ marginTop: '20px' }}>
            <div
              style={{
                background: '#C0C0C0',
                height: '18px',
                width: '18px',
                borderRadius: '100px',
                border: '2px solid #f5f5f5',
                marginRight: '4px'
              }}
            />
            <span className="category-name">Inactive loaders</span>
            <hr />
          </div>
          <div className="filter-bottom">
            <FilterButton
              text="All"
              index={2}
              filtervalue={filterButton}
              setFilterValue={e => setFilterButton(e)}
            />
            <FilterButton
              image1="freight-wagon(1).png"
              image2="freight-wagon(2).png"
              index={1}
              filtervalue={filterButton}
              setFilterValue={e => setFilterButton(e)}
            />
            <FilterButton
              image1="van.png"
              image2="van(1).png"
              index={0}
              filtervalue={filterButton}
              setFilterValue={e => setFilterButton(e)}
            />
          </div>
          {filterVehicle && filterVehicle?.length === 0 ? (
            <p
              style={{
                fontSize: '20px',
                textAlign: 'center',
                color: 'gray'
              }}
            >
              <AiOutlineExclamationCircle style={{ fontSize: '70px' }} />
              <br />
              No shipment created.
              <br />
              Please create a shipment first.
            </p>
          ) : (
            <Grid
              container
              spacing={2}
              style={{
                backgroundColor: '#C0C0C0',
                padding: '20px 10px 0',
                borderRadius: '10px'
              }}
            >
              {' '}
              {filterVehicle &&
                  filterVehicle?.map((e, index) => (
                  // console.log(e.vehicle_type),
                  
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={index}
                    style={{ marginBottom: '20px' }}
                  >
                    <AnalyticsCard
                      data={e}
                      setReverseShipmentFormOpen={setReverseShipmentFormOpen}
                      loaderCard
                      status={2}
                      filter={filterButton}
                    />
                  </Grid>
                ))}{' '}
            </Grid>
          )}{' '}
        </div>
      </div>
      {detailModalOpen ? (
        <AddMoreBagsModal
          showDivision
          open={detailModalOpen}
          close={() => setDetailModalOpen(null)}
          heading="Transaction details"
          handleSubmit={() => {
            // handleBagIncrement(e);
            setDetailModalOpen(null);
          }}
          handleStop={() => {
            // handleStop(e);
            setDetailModalOpen(null);
          }}
          handleBagDone={handleBagDone}
          hideModify
        />
      ) : null}
      {rejectModalOpen ? (
        <InfoModal
          open={rejectModalOpen}
          close={() => setRejectModalOpen(null)}
          title="Misprint bags"
          hideConfirm
          hideComment
        >
          <DefectiveBags transaction_id={rejectModalOpen?.id} />
        </InfoModal>
      ) : null}
      {bagModifyModalOpen ? (
        <AddMoreBagsModal
          onlyBags
          open={bagModifyModalOpen}
          close={() => setBagModifyModalOpen(null)}
          handleSubmit={e => {
            handleBagIncrement(e);
            setBagModifyModalOpen(null);
          }}
        />
      ) : null}{' '}
    </>
  );
};

LoaderAnalysis.propTypes = {
  vehicleBelts: PropTypes.any,
  setReverseShipmentFormOpen: PropTypes.func,
  ongoingTransactions: PropTypes.any,
  handleBagDone: PropTypes.func,
  filterButton: PropTypes.number,
  filterVehicle: PropTypes.any,
};

export default LoaderAnalysis;
