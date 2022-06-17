import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import searchFuelDetails from '../../../data/hooks/fuelData';
import { useQuery } from 'react-query';
import { Box, Divider, Skeleton, Typography } from '@mui/material';
import inComingLoad from '../inComing.ico';

import dayjs from 'dayjs';
import useGasStations from '../../hooks/useGasStations';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime, { rounding: Math.floor });

export default function CitiesList({ selectedCity, setCurrentLocation }: any) {
    const { cityId, districtId, provinceId } = selectedCity;
    const [allSheds, allShedsError, isLoadingAllSheds] = useGasStations();

    const {
        isError: isP92Error,
        isLoading: isP92Loading,
        data: p92Data,
        error: p92Error,
    } = useQuery(['p92', provinceId, cityId, districtId], searchFuelDetails);
    const {
        isError: isP95Error,
        isLoading: isP52Loading,
        data: p95Data,
        error: p95Error,
    } = useQuery(['p95', provinceId, cityId, districtId], searchFuelDetails);
    const {
        isError: isDError,
        isLoading: isDLoading,
        data: dData,
        error: dError,
    } = useQuery(['d', provinceId, cityId, districtId], searchFuelDetails);
    let allData = [];
    if (dData && p92Data && p95Data) {
        for (const petrol92 of p92Data) {
            allData.push({
                petrol92,
                petrol95: p95Data.find(
                    ({ shedId }: any) => shedId === petrol92.shedId
                ),
                diesel: dData.find(
                    ({ shedId }: any) => shedId === petrol92.shedId
                ),
            });
        }
    }
    const locateShed = (event: any) => {
        const { id: currentID } = event.currentTarget;
        const found = allSheds.find(({ id }: any) => id === Number(currentID));
        if (found) {
            const { latitude, longitude } = found;
            setCurrentLocation({
                coords: { latitude: longitude, longitude: latitude },
                zoom: 17,
            });
        }
    };
    return (
        <List
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                maxHeight: '60vh',
                overflowY: 'scroll',
            }}
        >
            {(isP92Loading || isDLoading) &&
                [1, 2, 3, 4].map((i) => (
                    <ListItem key={i}>
                        <ListItemText
                            primary={<Skeleton />}
                            secondary={<Skeleton />}
                        />
                        <Skeleton />
                    </ListItem>
                ))}
            {allData.length > 0 &&
                allData
                    .sort((a, b) =>
                        dayjs(a.petrol92.eta).isAfter(dayjs(b.petrol92.eta))
                            ? -1
                            : 1
                    )
                    .map((shed) => (
                        <>
                            <ListItem
                                onClick={locateShed}
                                key={shed.petrol92.shedId}
                                id={shed.petrol92.shedId}
                            >
                                <Box display="flex" flexDirection="column">
                                    <Box>
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6">
                                                    {shed.petrol92.shedName}
                                                </Typography>
                                            }
                                        />
                                    </Box>

                                    <Box>
                                        Petrol 92
                                        {shed.petrol92.bowserDispatch ? (
                                            <Box
                                                display="inline"
                                                color="green"
                                                ml={2}
                                            >
                                                <img
                                                    width={60}
                                                    src={inComingLoad}
                                                />
                                                ETA:{' '}
                                                {dayjs().to(
                                                    dayjs(
                                                        shed.petrol92.eta.split(
                                                            ','
                                                        )[0]
                                                    )
                                                )}
                                            </Box>
                                        ) : (
                                            <Box
                                                display="inline"
                                                color="red"
                                                ml={2}
                                            >
                                                Not dispatched
                                            </Box>
                                        )}
                                    </Box>
                                    <Box>
                                        Petrol 95
                                        {shed.petrol95.bowserDispatch ? (
                                            <Box
                                                display="inline"
                                                color="green"
                                                ml={2}
                                            >
                                                <img
                                                    width={60}
                                                    src={inComingLoad}
                                                />
                                                ETA:{' '}
                                                {dayjs().to(
                                                    dayjs(
                                                        shed.petrol95.eta.split(
                                                            ','
                                                        )[0]
                                                    )
                                                )}
                                            </Box>
                                        ) : (
                                            <Box
                                                display="inline"
                                                color="red"
                                                ml={2}
                                            >
                                                Not dispatched
                                            </Box>
                                        )}
                                    </Box>
                                    <Box>
                                        Diesel (Normal)
                                        {shed.diesel.bowserDispatch ? (
                                            <Box
                                                display="inline"
                                                color="green"
                                                ml={2}
                                            >
                                                <img
                                                    width={60}
                                                    src={inComingLoad}
                                                />
                                                ETA:{' '}
                                                {dayjs().to(
                                                    dayjs(
                                                        shed.diesel.eta.split(
                                                            ','
                                                        )[0]
                                                    )
                                                )}
                                            </Box>
                                        ) : (
                                            <Box
                                                display="inline"
                                                color="red"
                                                ml={2}
                                            >
                                                Not dispatched
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </ListItem>
                            <Divider
                                orientation="horizontal"
                                variant="fullWidth"
                            />
                        </>
                    ))}
        </List>
    );
}
