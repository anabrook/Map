import "leaflet/dist/leaflet.css";
import "./App.css";
import "leaflet-draw/dist/leaflet.draw.css";

import {
  Backdrop,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L, { LatLng } from "leaflet";
import React, { useEffect, useState } from "react";

import { Country } from "./interfaces/country";
import { EditControl } from "react-leaflet-draw";
import axios from "./config/axios";

function App() {
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [filtered, setFiltered] = useState<Array<Country>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCountries = async () => {
    setLoading((oldState) => !oldState);
    axios
      .get("/get-countries")
      .then((response) => {
        setLoading((oldState) => !oldState);
        setCountries(response.data);
        //setFiltered(response.data);
      })
      .catch((error) => {
        setLoading((oldState) => !oldState);
        console.log(error);
        alert("Erro ao carregar dados");
      });
  };

  useEffect(() => {
    getCountries();
  }, []);

  const filterContries = async (baseValues: LatLng[]) => {
    const proc = baseValues.map((e) => {
      return [e.lng, e.lat];
    });
    setLoading((oldState) => !oldState);
    axios
      .post("/filter-countries", {
        coordinates: proc,
      })
      .then((response) => {
        console.log(response.data);
        setLoading((oldState) => !oldState);
        setFiltered(response.data);
      })
      .catch((error) => {
        setLoading((oldState) => !oldState);
        console.log(error);
        alert("Erro ao filtrar");
      });
  };

  const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.8.0/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.8.0/dist/images/marker-icon.png",
    className: "icon",
    shadowUrl: "https://unpkg.com/leaflet@1.8.0/dist/images/marker-shadow.png",
    shadowRetinaUrl:
      "https://unpkg.com/leaflet@1.8.0/dist/images/marker-shadow.png",
  });
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <MapContainer
          center={[0, 0]}
          style={{
            height: "80vh",
            width: "100%",
          }}
          zoom={2}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />

          {countries.map((country, index) => (
            <Marker
              key={index}
              icon={icon}
              position={{
                lat: country.location.coordinates[1],
                lng: country.location.coordinates[0],
              }}
            >
              <Popup>
                {country.name} - {country.country}{" "}
                {country.location.coordinates[1]}{" "}
                {country.location.coordinates[0]}
              </Popup>
            </Marker>
          ))}
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <EditControl
              position="topright"
              onEdited={(e: any) => {
                console.log(e);
              }}
              onCreated={(e: any) => {
                filterContries(e.layer._latlngs[0]);
              }}
              onDeleted={(e: any) => {
                console.log(e);
              }}
              draw={{
                marker: false,
                circle: false,
                circlemarker: false,
                polyline: false,
                rectangle: false,
              }}
            />
            <Circle center={[-14.235004, -51.92528]} radius={200000} />
          </FeatureGroup>
        </MapContainer>
      </div>
      {filtered.length > 0 && (
        <Paper style={{ margin: 20 }}>
          <Grid container spacing={2} style={{ margin: 20 }}>
            <Grid item>
              <Typography variant="h1" fontSize={"2rem"} fontWeight="500">
                Países selecionados
              </Typography>
            </Grid>
            {filtered.map((country, index) => {
              return (
                <Grid item xs={12} key={index}>
                  <Typography>
                    • <b>{index + 1} -</b> {country.name} - {country.country}{" "}
                    {country.location.coordinates[1]}{" "}
                    {country.location.coordinates[0]}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}
    </>
  );
}

export default App;
