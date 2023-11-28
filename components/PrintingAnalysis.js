import { useState } from 'react';
import { Grid } from '@material-ui/core';
import AnalyticsCard from 'components/AnalyticsCard';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import PropTypes from 'prop-types';
import DefectiveBags from 'components/DefectiveBags';
import InfoModal from 'components/InfoModal';

function PrintingAnalysis({ printingBelts, handleBeltReset }) {
  const [rejectModalOpen, setRejectModalOpen] = useState(null);

  return (
    <>
      <div className="analysis-container">
        <div className="analytics">
          {printingBelts && Object.keys(printingBelts)?.length === 0 ? (
            <p style={{ fontSize: '20px', textAlign: 'center', color: 'gray' }}>
              <AiOutlineExclamationCircle style={{ fontSize: '70px' }} />
              <br />
              No info found.
              <br />
            </p>
          ) : (
            <Grid container spacing={2}>
              {printingBelts &&
                Object.keys(printingBelts)?.map((e, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <AnalyticsCard
                      data={{
                        ...printingBelts[e],
                      }}
                      rejectModalOpen={() =>
                        setRejectModalOpen({
                          ...printingBelts[e],
                          printing_belt_id: e,
                        })
                      }
                      handleBeltReset={handleBeltReset}
                      printingCard
                      status={0}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
        </div>
      </div>
      {rejectModalOpen ? (
        <InfoModal
          open={rejectModalOpen}
          close={() => setRejectModalOpen(null)}
          title="Misprint bags"
          hideConfirm
          hideComment
        >
          <DefectiveBags
            belt_id={rejectModalOpen?.printing_belt_id}
            // hour={hour}
            date={[
              {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
              },
            ]}
            dateUnAltered={true}
          />
          {/* <DefectiveBags belt_id={rejectModalOpen?.printing_belt_id} /> */}
        </InfoModal>
      ) : null}
    </>
  );
}

PrintingAnalysis.propTypes = {
  printingBelts: PropTypes.object,
  handleBeltReset: PropTypes.func,
};

export default PrintingAnalysis;
