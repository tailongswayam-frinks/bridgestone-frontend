import { useEffect, useState } from 'react';
import Container from 'styles/summary.styles';
import { Grid, Select, ButtonGroup, Button, MenuItem } from '@material-ui/core';
import { get, getFile } from 'utils/api';
import Layout from 'components/Layout';
import Maintenance from 'components/Maintenance';
import Notification from 'components/Notification';
import {
  LocalizationProvider,
  DateCalendar,
  DatePicker,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import Loader from 'components/Loader';
import dayjs from 'dayjs';
import SummaryChart from './SummaryChart';
import SummaryAnalysis from './SummaryAnalysis';
import SummaryLoaderAnalysis from './SummaryLoaderAnalysis';

const downloadPDF = (file) => {
  const downloadLink = document.createElement('a');
  const fileName = 'report.xlsx';
  downloadLink.setAttribute('download', fileName);
  downloadLink.href = URL.createObjectURL(new Blob([file]));
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
};

const useStyles = makeStyles((theme) => ({
  select: {
    width: '300px',
    [theme.breakpoints.up(1550)]: {
      width: '450px',
      marginRight: '150px',
      marginLeft: '-40px',
    },
    [theme.breakpoints.down(1550)]: {
      // width: '450px',
      marginRight: 'auto',
    },
  },
  select_1: {
    width: '200px',
    [theme.breakpoints.up(1550)]: {
      width: '250px',
      marginRight: '-30px',
    },
  },
  select_2: {
    width: '100px',
    [theme.breakpoints.up(1550)]: {
      width: '125px',
    },
  },
}));

function Summary() {
  const classes = useStyles();
  const [bagType, setBagType] = useState(0);
  const [filter, setFilter] = useState(0);
  const [shiftType, setShiftType] = useState(0);

  const [summaryData, setSummaryData] = useState(null);
  const [shiftDate, setShiftDate] = useState(null);
  const [printingBelts, setPrintingBelts] = useState(null);
  const [shiftCount, setShiftCount] = useState(null);
  const [maintenanceTickets, setMaintenanceTickets] = useState(null);
  const [maintenanceFormOpen, setMaintenanceFormOpen] = useState(false);
  const [notificationsFormOpen, setNotificationsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };

  // const getCurrentFormattedDate = () => {
  //   const currentDate = new Date();
  //   const day = String(currentDate.getDate()).padStart(2, '0');
  //   const monthIndex = currentDate.getMonth();
  //   const year = currentDate.getFullYear();

  //   const months = [
  //     'Jan',
  //     'Feb',
  //     'Mar',
  //     'Apr',
  //     'May',
  //     'Jun',
  //     'Jul',
  //     'Aug',
  //     'Sep',
  //     'Oct',
  //     'Nov',
  //     'Dec'
  //   ];

  //   const month = months[monthIndex];

  //   return `${day} ${month}, ${year}`;
  // };

  // const currentFormattedDate = getCurrentFormattedDate();
  const [time, setTime] = useState(dayjs(new Date()));

  useEffect(() => {
    const fetchSummary = async () => {
      const dateObj = new Date(time);

      const newDateRange = [
        dateObj.setUTCHours(-6, 30, 0, 999),
        dateObj.setUTCHours(-6, 30, 0, 999) + 86400000,
        // dateObj.setUTCHours(17, 89, 59, 999)
      ];

      newDateRange[1] += 86399000;

      const newUpdatedDateRange = [newDateRange[0] + 86400000, newDateRange[1] + 86400000];
      // console.log(newDateRange, newUpdatedDateRange);
      const data = await get('/api/stats/summarized-stats', {
        // dateRange: getStartAndEndDate()
        dateRange: newDateRange,
        shift: shiftType,
        updatedDateRange: newUpdatedDateRange,
      });
      setSummaryData(data?.data?.data?.analysis);
      setShiftCount(data?.data?.data?.shift);
      setShiftDate(data?.data?.data?.date);
      setPrintingBelts(data?.data?.data?.belt_info);
      setMaintenanceTickets(data?.data?.data?.maintenance_tickets);
      setIsLoading(false);

      // const missedLabelData = await get('api/shipment/reject-bags-shiftwise', {
      //   machine_id: '651BCA',
      //   dateRange: newDateRange,
      //   shift: 3,
      //   updatedDateRange: newUpdatedDateRange
      // });
      // console.log(missedLabelData?.data?.data);
    };
    fetchSummary();
  }, [time, shiftType]);

  const handleDownload = async () => {
    const dateObj = new Date(time);

    const newDateRange = [
      dateObj.setUTCHours(-6, 30, 0, 999),
      dateObj.setUTCHours(-6, 30, 0, 999) + 86400000,
      // dateObj.setUTCHours(17, 89, 59, 999)
    ];

    newDateRange[1] += 86399000;

    const newUpdatedDateRange = [newDateRange[0] + 86400000, newDateRange[1] + 86400000];
    // console.log(newDateRange, newUpdatedDateRange);
    const res = await getFile('/api/report/datewise', {
      dateRange: newDateRange,
      updatedDateRange: newUpdatedDateRange,
    });
    downloadPDF(res.data);
  };

  // const markMaintenanceComplete = async id => {
  //   try {
  //     await put('/api/maintenance', { id });
  //     setMaintenanceTickets(prevData =>
  //       prevData.map(e => {
  //         if (e.id === id) return { ...e, marked_complete: 1 };
  //         return e;
  //       })
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  if (notificationsFormOpen) {
    return <Notification close={() => setNotificationsFormOpen(false)} />;
  }

  if (maintenanceFormOpen) {
    return <Maintenance close={() => setMaintenanceFormOpen(false)} />;
  }

  return (
    <Container>
      {isLoading ? <Loader /> : null}
      <div className="analysis-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            // height: '40px',
            marginTop: '5px',
            alignItems: 'center',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="view">
              <Select
                value={filter}
                className={classes.select}
                onChange={(e) => setFilter(e.target.value)}
                native={true}
                inputProps={{ 'data-testid': 'filter_select' }}
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#3A0CA3',
                  background: 'white',
                  outlineColor: '#3A0CA3',
                  border: '1px solid #3A0CA3',
                  // width: '450px',
                  padding: '0px',
                  // marginLeft: '-40px'
                }}
                variant="outlined"
                IconComponent={KeyboardArrowDownSharpIcon}
              >
                <option value={0}>Packer Summary</option>
                <option value={1}>Loader Summary</option>
              </Select>
            </div>

            <ButtonGroup
              // className={classes.select_1}
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                className={classes.select_2}
                style={{
                  backgroundColor: bagType === 0 ? '#B5179E' : '#F5F5F5',
                  color: bagType === 1 ? '#B5179E' : '#F5F5F5',
                  // width: '120px',
                  height: '50px',
                }}
                onClick={() => {
                  setBagType(0);
                }}
              >
                BAGS
              </Button>
              <Button
                className={classes.select_2}
                style={{
                  backgroundColor: bagType === 1 ? '#B5179E' : '#F5F5F5',
                  color: bagType === 0 ? '#B5179E' : '#F5F5F5',
                  // width: '120px',
                  height: '50px',
                }}
                onClick={() => {
                  setBagType(1);
                }}
              >
                TONNAGE
              </Button>
            </ButtonGroup>

            <div className="view">
              {/* <Select
                className={classes.select_1}
                value={0}
                // onChange={e => {
                //   console.log(e.target.value);
                //   setTime(e.target.value);
                // }}
                style={{
                  fontSize: '14px',
                  background: 'white',
                  // width: '240px',
                  // outline: 'none',
                  outlineColor: 'blue'
                }}
                IconComponent={KeyboardArrowDownSharpIcon}
                variant="outlined"
              >
                <MenuItem value={0}>{time}</MenuItem>
                <DateCalendar
                  val={0}
                  editableDateInputs
                  onMonthChange={month => {
                    console.log(month);
                  }}
                  onYearChange={() => {}}
                  onChange={item => {
                    // console.log(item);
                    console.log('time');
                    // console.log(item?.$d.toDateString());
                    console.log(item?.$d.toLocaleDateString('en-US', options));
                    setTime(item?.$d.toLocaleDateString('en-US', options));
                    // setDateUnAltered(false);
                  }}
                  moveRangeOnFirstSelection={false}
                  // ranges={date}
                  rangeColors={['#051c3f']}
                />
              </Select> */}
              <DesktopDatePicker
                format="DD MMM, YYYY"
                value={time}
                onChange={(item) => {
                  // console.log(time);
                  // setTime(item?.$d.toLocaleDateString('en-US', options));

                  setTime(dayjs(item?.$d));
                }}
                sx={{ bgcolor: 'white' }}
              />
            </div>

            <div className="view">
              <Select
                className={classes.select_1}
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value)}
                style={{
                  fontSize: '14px',
                  background: 'white',
                  // width: '240px',
                  // marginRight: '-20px'
                }}
                variant="outlined"
                IconComponent={KeyboardArrowDownSharpIcon}
              >
                <MenuItem value={0}>Shift A</MenuItem>
                <MenuItem value={1}>Shift B</MenuItem>
                <MenuItem value={2}>Shift C</MenuItem>
                <MenuItem value={3}>All Shifts</MenuItem>
              </Select>
            </div>
            <div className="view">
              <Button
                variant="outlined"
                className="download-button"
                color="primary"
                onClick={handleDownload}
              >
                <AiOutlineCloudDownload />
              </Button>
            </div>
          </LocalizationProvider>
        </div>

        <div className="summary-container" style={{ marginTop: '20px' }}>
          <div className="left-portion">
            <div
              className="count-container"
              style={{
                // marginLeft: '40px',
                marginTop: '20px',
                // marginRight: '40px'
              }}
            >
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <div className="count-block" style={{ background: '#3A71A5' }}>
                    <p className="count">
                      {summaryData
                        ? filter === 0
                          ? bagType === 0
                            ? `${summaryData?.total_bags_packed} Bags`
                            : `${summaryData?.total_bags_packed / 20} Tones`
                          : bagType === 0
                          ? `${summaryData?.total_bags_dispatched} Bags`
                          : `${summaryData?.total_bags_dispatched / 20} Tones`
                        : 'NA'}
                    </p>
                    <p className="description">
                      {filter === 0 ? 'Total Production' : 'Total Dispatch'}
                    </p>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="count-block" style={{ background: '#FF5742' }}>
                    <p className="count">
                      {summaryData
                        ? filter === 0
                          ? bagType === 0
                            ? `${summaryData?.total_missed_labels} Bags`
                            : `${summaryData?.total_missed_labels / 20} Tones`
                          : bagType === 0
                          ? `${summaryData?.total_burstage_count} Bags`
                          : `${summaryData?.total_burstage_count / 20} Tones`
                        : 'NA'}
                    </p>
                    <p className="description">{filter === 0 ? 'Misprint Cases' : 'Burstage'}</p>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="maintenance-container" style={{ marginTop: '50px' }}>
              <Layout
                alternateHeader
                title={filter === 0 ? 'Hourly Packer Data' : 'Hourly Loading Analytics'}
                hideFooter
                counter={0}
                summaryHeader
                disableMinimumHeight
                viewAllFunc={() => setMaintenanceFormOpen(true)}
                // style={{ maxHeight: '60vh', overflowY: 'auto' }}
                style={{
                  background: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SummaryChart
                  hourlyPackerData={summaryData?.HourlyPackerBags}
                  hourlyLoaderData={summaryData?.HourlyLoaderBags}
                  filter={filter}
                />
              </Layout>
            </div>
          </div>
          <div className="right-portion" style={{ marginTop: '20px' }}>
            <div className="notification-container" style={{ marginBottom: '10px' }}>
              <Layout
                alternateHeader
                title={filter === 0 ? 'Packer Analysis' : 'Loader Analysis'}
                hideFooter
                // counter={summaryData?.total_missed_labels || 0}
                summaryHeader
                disableMinimumHeight
                viewAllFunc={() => setNotificationsFormOpen(true)}
                style={{
                  maxHeight: '58vh',
                  background: 'white',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                <div className="count-container">
                  {!filter &&
                    summaryData?.packerBags &&
                    Object.keys(summaryData?.packerBags)?.map((key) => {
                      const value = summaryData?.packerBags[key];

                      return (
                        <SummaryAnalysis
                          filter={filter}
                          key1={key}
                          value={value}
                          bagType={bagType}
                          runTimePackerSummary={summaryData?.runTimePackerSummary}
                          perHourDispatch={summaryData?.perHourDispatch}
                        />
                      );
                    })}
                  {filter ? (
                    <Grid container spacing={3}>
                      {summaryData?.loaderBags &&
                        Object.keys(summaryData?.loaderBags)?.map((key) => {
                          const value = summaryData?.loaderBags[key];
                          // console.log(key, summaryData?.vehicleType[key]);
                          return (
                            <SummaryLoaderAnalysis
                              filter={filter}
                              key1={key}
                              value={value}
                              bagType={bagType}
                              vehicleType={summaryData?.vehicleType[key]}
                            />
                          );
                        })}
                    </Grid>
                  ) : null}
                </div>
              </Layout>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Summary;
