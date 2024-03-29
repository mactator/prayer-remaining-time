/* eslint-disable no-unused-vars */
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Divider, Stack } from "@mui/material";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import "moment/dist/locale/ar-dz";

moment.locale("ar");

export default function MainContent() {
  const [nextPrayerindex, setNextPrayerIndex] = useState(2);
  const [remainingTime, setRemainingTime] = useState("");

  const [timings, setTimings] = useState({
    Fajr: "04:15",
    Dhuhr: "11:58",
    Asr: "15:25",
    Maghrib: "18:07",
    Isha: "19:37",
  });

  const availableCities = [
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "جدة",
      apiName: "Jeddah",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },

    {
      displayName: "المدينة المنورة",
      apiName: "Madinah",
    },
    {
      displayName: "مكة المكرمة",
      apiName: "Makka al Mukarramh",
    },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const [city, setCity] = useState({
    displayName: "الرياض",
    apiName: "Riyadh",
  });

  const [today, setToday] = useState("");

  const getTimings = async () => {
    console.log("calling api");
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${city.apiName}`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [city]);

  useEffect(() => {
    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));
    console.log(t);

    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const now = moment();
    let nextPrayer = 2;

    if (
      now.isAfter(moment(timings.Fajr, "HH:mm")) &&
      now.isBefore(moment(timings.Dhuhr, "HH:mm"))
    ) {
      nextPrayer = 1;
    } else if (
      now.isAfter(moment(timings.Dhuhr, "HH:mm")) &&
      now.isBefore(moment(timings.Asr, "HH:mm"))
    ) {
      nextPrayer = 2;
    } else if (
      now.isAfter(moment(timings.Asr, "HH:mm")) &&
      now.isBefore(moment(timings.Maghrib, "HH:mm"))
    ) {
      nextPrayer = 3;
    } else if (
      now.isAfter(moment(timings.Maghrib, "HH:mm")) &&
      now.isBefore(moment(timings.Isha, "HH:mm"))
    ) {
      nextPrayer = 4;
    } else {
      nextPrayer = 0;
    }

    setNextPrayerIndex(nextPrayer);

    const nextPrayerObject = prayersArray[nextPrayer];
    const nextPrayerTime = timings[nextPrayerObject.key];

    let timeLeft = moment(nextPrayerTime, "HH:mm").diff(now);

    if (timeLeft < 0) {
      const midNigthDiff = moment("23:59:59", "hh:mm:ss").diff(now);
      const fajrToMidnightDiff = moment(nextPrayerTime, "hh:mm").diff(
        moment("00:00:00", "HH:mm:ss")
      );

      const totoalTime = fajrToMidnightDiff + midNigthDiff;
      timeLeft = totoalTime;
    }

    const duration = moment.duration(timeLeft);
    setRemainingTime(
      `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`
    );

    // setTimer(`${hours}:${minutes}:${seconds}`);
  };

  const handleChange = (event) => {
    const cityObject = availableCities.find(
      (city) => city.apiName == event.target.value
    );
    console.log(event.target.value);
    setCity(cityObject);
  };
  return (
    <>
      <Grid container style={{}}>
        <Grid item xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{city.displayName}</h1>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <h2>متبقي حتى صلاة {prayersArray[nextPrayerindex].displayName}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: "white", opacity: "0.1" }} />

      <Stack
        direction="row"
        justifyContent="space-around"
        style={{ marginTop: "50px" }}
      >
        <Prayer
          prayer="الفجر "
          time={timings.Fajr}
          image="https://cdn.pixabay.com/photo/2024/03/06/08/56/ai-generated-8616062_1280.jpg"
        />
        <Prayer
          prayer="الظهر "
          time={timings.Dhuhr}
          image="https://cdn.pixabay.com/photo/2020/11/24/18/58/mosque-5773586_1280.jpg"
        />
        <Prayer
          prayer="العصر "
          time={timings.Asr}
          image="https://cdn.pixabay.com/photo/2015/01/28/23/10/mosque-615415_1280.jpg"
        />
        <Prayer
          prayer="المغرب "
          time={timings.Maghrib}
          image="https://cdn.pixabay.com/photo/2024/03/16/02/09/ai-generated-8636065_1280.png"
        />
        <Prayer
          prayer="العشاء "
          time={timings.Isha}
          image="https://cdn.pixabay.com/photo/2022/03/10/13/46/mosque-7059889_1280.png"
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={10}
            label="Age"
            onChange={handleChange}
          >
            {availableCities.map((city) => (
              <MenuItem key={city.apiName} value={city.apiName}>
                {city.displayName}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
