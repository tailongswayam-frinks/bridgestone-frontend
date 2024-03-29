import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  makeStyles,
  StepConnector,
  withStyles,
  FormControl,
  Select,
  MenuItem,
  TextField,
  // Button
} from '@material-ui/core';
import Image from 'next/image';
// import { MdAddBox } from 'react-icons/md';
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/Layout';
import Container from 'styles/config.styles';
import ImageKitLoader from 'utils/ImageLoader';
import ServiceQuery from 'reactQueries/shipmentQueries';
import FrinksButton from 'components/FrinksButton';
import Loader from 'components/Loader';
import InfoModal from 'components/InfoModal';
import { GlobalContext } from 'context/GlobalContext';
import { get } from 'utils/api';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const getSteps = (loaderType) => [
  'Belts\' details',
  `${loaderType === null ? 'Loader' : loaderType === 0 ? 'Truck' : 'Wagon'
  } configuration`,
  'No. of bags needed to filled',
];

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: 'black',
      opacity: '0.1',
    },
  },
  completed: {
    '& $line': {
      borderColor: 'black',
      opacity: '0.1',
    },
  },
  line: {
    borderColor: 'black',
    borderTopWidth: 3,
    borderRadius: 1,
    opacity: '0.1',
  },
})(StepConnector);

function QontoStepIcon(props) {
  const { completed } = props;

  return (
    <div>
      {completed ? (
        <Image
          src="completed_stepper_9e75U34X9.svg"
          loader={ImageKitLoader}
          layout="fixed"
          height={25}
          width={25}
        />
      ) : (
        <Image
          src="active_stepper_sr9KSBh3I.svg"
          loader={ImageKitLoader}
          layout="fixed"
          height={25}
          width={25}
        />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = { completed: PropTypes.bool };

function Config({
  close,
  handleSubmit,
  reverseShipmentFormOpen,
  setReverseShipmentFormOpen,
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [loaderId, setLoaderId] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [bagType, setBagType] = useState('');
  const [bagCount, setBagCount] = useState('0');
  const [vehicleIds, setVehicleIds] = useState(null);
  const serviceMutation = ServiceQuery();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [loaderType, setLoaderType] = useState(null);
  const steps = getSteps(loaderType);
  const [wagonno, setWagonno] = useState('');
  const [gateno, setGateno] = useState('');
  const [isUsedBeltSelected, setIsUsedBeltSelected] = useState(false);
  const { bagTypes: BAG_TYPES } = useContext(GlobalContext);

  useEffect(() => {
    const fetchVehicle = async (vehicleId) => {
      const res = await get('/api/shipment/vehicle', {
        id: null,
      });
      if (vehicleId) {
        setLoaderId(vehicleId);
        setLoaderType(
          res?.data?.data?.find((obj) => obj.id === vehicleId)?.vehicle_type,
        );
      }
      setVehicleIds(res?.data?.data);
    };
    if (reverseShipmentFormOpen && !vehicleIds) {
      // fetch beltIds
      fetchVehicle(reverseShipmentFormOpen);
    } else if (
      // printingId !== '' &&
      !vehicleIds) {
      // fetch beltIds
      fetchVehicle();
    }
  }, [vehicleIds, reverseShipmentFormOpen]);

  // useEffect(() => {
  //   const fetchPrintingBeltsIds = async () => {
  //     const res = await get('/api/shipment/printing-belt', {
  //       vehicle_id: reverseShipmentFormOpen,
  //     });
  //     setBeltIds(res?.data?.data);
  //   };
  //   fetchPrintingBeltsIds();
  //   return () => {
  //     setBeltIds(null);
  //   };
  // }, [reverseShipmentFormOpen]);

  useEffect(() => {
    if (
      // printingId !== '' &&
      loaderId !== '') {
      setActiveStep(Math.max(1, activeStep));
    }
  }, [activeStep, loaderId]);

  useEffect(() => {
    if (
      licenceNumber !== ''
      || (wagonno !== '' && gateno !== '')
    ) {
      setActiveStep(Math.max(2, activeStep));
    }
  }, [activeStep, licenceNumber, gateno, wagonno]);

  useEffect(() => {
    if (
      bagType !== ''
      && bagCount !== '0'
      && bagCount !== 0
      && bagCount !== ''
    ) {
      setActiveStep(Math.max(3, activeStep));
    }
  }, [activeStep, bagCount, bagType]);

  /* react/no-unstable-nested-components */
  function StepOption(op) {
    switch (op) {
      case 1:
        return (
          <div className="form-part">
            {loaderType === 0 ? (
              <div className="input-container">
                <div className="label">Truck no.</div>
                <TextField
                  type="text"
                  variant="outlined"
                  placeholder="Truck no."
                  value={licenceNumber}
                  onChange={(e) => setLicenceNumber(e.target.value)}
                />
              </div>
            ) : (
              <>
                {/* <div className="input-container">
                  <div className="label">Rake no.</div>
                  <TextField
                    variant="outlined"
                    placeholder="Rake no."
                    value={rackno}
                    onChange={(e) => setRackno(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </div> */}
                <div className="input-container">
                  <div className="label">Wagon no.</div>
                  <TextField
                    variant="outlined"
                    placeholder="Wagon no."
                    value={wagonno}
                    onChange={(e) => setWagonno(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </div>
                <div className="input-container">
                  <div className="label">Gate/Door no.</div>
                  <FormControl>
                    {gateno === '' ? (
                      <div className="select-label">Gate/Door no.</div>
                    ) : null}
                    <Select
                      variant="outlined"
                      value={gateno}
                      onChange={(e) => setGateno(e.target.value)}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div className="form-part">
            <div className="input-container">
              <div className="label">Bag type</div>
              <FormControl>
                {bagType === '' ? (
                  <div className="select-label">Bag type</div>
                ) : null}
                <Select
                  variant="outlined"
                  value={bagType}
                  onChange={(e) => setBagType(e.target.value)}
                >
                  {BAG_TYPES.map((e, index) => (
                    <MenuItem value={e} key={index}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="input-container">
              <div className="label">No. of bags</div>
              <div className="counter-container">
                <Image
                  src="subtract_KLMfUKuhe.svg"
                  loader={ImageKitLoader}
                  layout="fixed"
                  height={40}
                  width={40}
                  onClick={() => setBagCount(
                    Math.max(1, parseInt(bagCount, 10) - 1).toString(),
                  )}
                />
                <TextField
                  variant="outlined"
                  value={bagCount}
                  onChange={(e) => {
                    if (e.target.value === '') setBagCount(1);
                    else if (!Number.isNaN(e.target.value)) {
                      setBagCount(
                        Math.max(
                          1,
                          Math.min(parseInt(e.target.value, 10), 2000),
                        ),
                      );
                    }
                  }}
                  style={{ width: '200px' }}
                  InputProps={{
                    inputProps: { min: 0, max: 2000 },
                  }}
                />
                <Image
                  src="add_W7hvn9BT_.svg"
                  loader={ImageKitLoader}
                  layout="fixed"
                  height={40}
                  width={40}
                  onClick={() => setBagCount(
                    Math.min(2000, parseInt(bagCount, 10) + 1).toString(),
                  )}
                />
              </div>
            </div>
          </div>
        );
      // case 3:
      //   return (
      //     <div className="form-part">
      //       <div className="input-container">
      //         <div className="label">Label example</div>
      //         <TextField
      //           type="text"
      //           variant="outlined"
      //           placeholder="Label example"
      //           value={labelExample}
      //           onChange={(e) => setLabelExample(e.target.value)}
      //         />
      //       </div>
      //     </div>
      //   );
      default:
        return (
          <div className="form-part">
            {/* <div className="input-container">
              <div className="label">Printing belt</div>
              <FormControl>
                {printingId === '' ? (
                  <div className="select-label">Printing belt</div>
                ) : null}
                <Select
                  variant="outlined"
                  value={printingId}
                  onChange={(e) => {
                    setIsUsedBeltSelected(
                      beltIds.filter((ele) => ele?.id === e?.target?.value)[0]
                        ?.is_busy === 1,
                    );
                    setPrintingId(e.target.value);
                    if (!reverseShipmentFormOpen) {
                      setVehicleIds(null);
                      setLoaderId('');
                    }
                    setLicenceNumber('');
                    setBagCount(0);
                    setBagType('');
                    setActiveStep(0);
                  }}
                >
                  {beltIds
                    && beltIds.map((e, index) => {
                      if (e?.is_busy) return null;
                      return (
                        <MenuItem value={e.id} key={index}>
                          <span className="dropdown-span">
                            <p>{e.machine_id}</p>
                            <p
                              style={{
                                height: '10px',
                                width: '10px',
                                background: `${e.is_busy ? 'red' : 'green'}`,
                                borderRadius: '100px',
                              }}
                            />
                          </span>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div> */}
            <div className="input-container">
              <div className="label">Loader belt</div>
              <FormControl>
                {loaderId === '' ? (
                  <div className="select-label">Loader belt</div>
                ) : null}
                <Select
                  variant="outlined"
                  value={loaderId}
                  onChange={(e) => {
                    setIsUsedBeltSelected(
                      vehicleIds.filter((ele) => ele?.id === e?.target?.value)[0]
                        ?.is_busy === 1,
                    );
                    setLoaderId(e.target.value);
                    setLoaderType(
                      vehicleIds.find((obj) => obj.id === e.target.value)
                        .vehicle_type,
                    );
                  }}
                  disabled={!vehicleIds || reverseShipmentFormOpen}
                >
                  {vehicleIds
                    && vehicleIds.map((e, index) => {
                      if (e?.is_busy) return null;
                      return (
                        <MenuItem value={e.id} key={index}>
                          <span className="dropdown-span">
                            <p>
                              {e.machine_id}
                              (
                              {e?.vehicle_type === 1 ? 'WL' : 'TL'}
                              )
                            </p>
                            <p
                              style={{
                                height: '10px',
                                width: '10px',
                                background: `${e.is_busy ? 'red' : 'green'}`,
                                borderRadius: '100px',
                              }}
                            />
                          </span>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
          </div>
        );
    }
  }

  useEffect(() => {
    if (serviceMutation.isSuccess) {
      serviceMutation.reset();
      close();
      setReverseShipmentFormOpen(null);
    }
  }, [close, serviceMutation, setReverseShipmentFormOpen]);

  const handleFormSubmit = async () => {
    setInfoModalOpen(false);
    await handleSubmit({
      printingId: null,
      loaderId,
      licenceNumber,
      bagType,
      bagCount,
      wagonno,
      gateno,
      labelExample: '',
    });
  };

  return (
    <Layout
      alternateHeader
      title="Create new shipment"
      close={(e) => {
        close(e);
        setReverseShipmentFormOpen(null);
      }}
      hideFooter
    >
      {serviceMutation.isLoading ? <Loader /> : null}
      <Container>
        <div className="form-container">
          <p className="title">
            Create shipment from here post filling all the available shipment
            information.
            <br />
            Shipment created can be later edited from main dashboard.
          </p>
          <form>
            <div className="stepper-container">
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                connector={<QontoConnector />}
              >
                {steps.map((label, index) => (
                  <Step
                    key={label}
                    active={
                      index === activeStep - 3
                      || index === activeStep - 2
                      || index === activeStep - 1
                      || index === activeStep
                    }
                  >
                    <StepLabel StepIconComponent={QontoStepIcon}>
                      {label}
                    </StepLabel>
                    <StepContent>
                      <div className={classes.actionsContainer}>
                        {StepOption(index)}
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className="submit-container">
              <p>
                Once you have marked all the choices as per your needs, click
                save.
              </p>
              <FrinksButton
                text={isUsedBeltSelected ? 'Add to Queue' : 'SAVE'}
                onClick={() => setInfoModalOpen(true)}
              />
            </div>
          </form>
        </div>
        {infoModalOpen ? (
          <InfoModal
            open={infoModalOpen}
            title="Confirm changes"
            close={() => setInfoModalOpen(false)}
            handleSubmit={() => handleFormSubmit()}
            onlyBags
            dataToDisplay={{
              loaderId: vehicleIds?.find((e) => e.id === loaderId)?.machine_id,
              licenceNumber,
              wagonNo: wagonno,
              rackNo: '',
              gateNo: gateno,
              bagType,
              bagCount,
              labelExample: '',
            }}
          />
        ) : null}
      </Container>
    </Layout>
  );
}

Config.propTypes = {
  close: PropTypes.func,
  handleSubmit: PropTypes.func,
  reverseShipmentFormOpen: PropTypes.func,
  setReverseShipmentFormOpen: PropTypes.func,
};

export default Config;
