import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { get } from 'utils/api';
import { BASE_URL } from 'utils/constants';
import LoaderRelationComponent from './LoaderRelationComponent';

export default function LoaderRelation() {
  const [printingBelts, setPrintingBelts] = useState(null);
  const [truckLoadingBelts, setTruckLoadingBelts] = useState(null);
  const [wagonLoadingBelts, setWagonLoadingBelts] = useState(null);
  const [loaderRelation, setLoaderRelation] = useState(null);
  const [truckCount, setTruckCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const fetchPrintingBelts = async () => {
    const res = await get(`${BASE_URL}/api/shipment/all-printing-belt`);
    console.log(res?.data?.data);
    setPrintingBelts(res?.data?.data);
  };
  const fetchLoadingBelts = async () => {
    const res = await get(`${BASE_URL}/api/shipment/all-vehicle`);
    // console.log(res?.data);
    const truckLoadingBeltTemp = [];
    const wagonLoadingBeltTemp = [];
    res?.data?.data?.map((item) => {
      if (item?.vehicle_type === 0) {
        truckLoadingBeltTemp.push(item);
      } else {
        wagonLoadingBeltTemp.push(item);
      }
      return 0;
    });
    setTruckLoadingBelts(truckLoadingBeltTemp);
    setWagonLoadingBelts(wagonLoadingBeltTemp);
  };

  const fetchLoadingRelation = async () => {
    const res = await get(`${BASE_URL}/api/shipment/get-loader-relation`);
    // console.log(res?.data);
    setLoaderRelation(res?.data);
  };

  useEffect(() => {
    fetchPrintingBelts();
    fetchLoadingBelts();
    fetchLoadingRelation();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 1790); // Set your desired breakpoint here
    };

    handleResize(); // Call the handler initially

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        marginTop: '120px',
        marginLeft: '50px',
        marginRight: '50px',
        paddingTop: '50px',
      }}
    >
      <div
        style={{
          backgroundColor: '#F3F4F6',
          paddingLeft: '50px',
          height: '75vh',
        }}
      >
        <Grid container alignItems="flex-start">
          <Grid container xs={5} spacing={2}>
            <Grid xs={12}>
              <h2 style={{ marginLeft: '30px', marginTop: '20px' }}>
                Truck Loaders
              </h2>
            </Grid>
            {truckLoadingBelts?.length === 0 && (
              <h4 style={{ marginLeft: '30px', marginTop: '50px' }}>
                No Truck Loaders
              </h4>
            )}
            {truckLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Loader ID
                </h4>
              </Grid>
            )}
            {truckLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Packer ID
                </h4>
              </Grid>
            )}
            {isMobile && truckLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Loader ID
                </h4>
              </Grid>
            )}
            {isMobile && truckLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Packer ID
                </h4>
              </Grid>
            )}

            {truckLoadingBelts?.map((item) => (
              <LoaderRelationComponent
                item={item}
                printingBelts={printingBelts}
                loaderRelation={loaderRelation}
                isLineBreak={truckCount % 2 === 1}
              />
            ))}
          </Grid>
          <hr style={{ marginLeft: '100px', marginRight: '100px' }} />
          <Grid container xs={5} spacing={2}>
            <Grid xs={12}>
              <h2 style={{ marginLeft: '30px', marginTop: '20px' }}>
                Wagon Loaders
              </h2>
            </Grid>
            {wagonLoadingBelts?.length === 0 && (
              <h4 style={{ marginLeft: '30px', marginTop: '50px' }}>
                No Wagon Loaders
              </h4>
            )}
            {wagonLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Loader ID
                </h4>
              </Grid>
            )}
            {wagonLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Packer ID
                </h4>
              </Grid>
            )}
            {isMobile && wagonLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Loader ID
                </h4>
              </Grid>
            )}
            {isMobile && wagonLoadingBelts?.length !== 0 && (
              <Grid xs={3}>
                <h4
                  style={{
                    marginLeft: '30px',
                    marginTop: '20px',
                    fontWeight: 800,
                  }}
                >
                  Packer ID
                </h4>
              </Grid>
            )}
            {wagonLoadingBelts?.map((item) => (
              <LoaderRelationComponent
                item={item}
                printingBelts={printingBelts}
                loaderRelation={loaderRelation}
              />
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
