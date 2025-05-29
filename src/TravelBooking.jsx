import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export default function TravelBooking() {
  const [formData, setFormData] = useState({
    tripType: "roundTrip",
    from: {},
    to: {},
    departureDate: "",
    returnDate: "",
    passengers: "1",
    class: "economy",
  });

  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTripTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tripType: value,
      returnDate: value === "oneWay" ? "" : prev.returnDate,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = "Please enter a departure city";
    if (!formData.to) newErrors.to = "Please enter a destination city";
    if (!formData.departureDate)
      newErrors.departureDate = "Please select a departure date";
    if (formData.tripType === "roundTrip" && !formData.returnDate)
      newErrors.returnDate = "Please select a return date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSearching(true);
      console.log("Form submitted:", formData);

      setTimeout(() => {
        setIsSearching(false);
        setSubmittedData(formData);
      }, 1500);
    }
  };

  const passengerOptions = Array.from({ length: 6 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} ${i === 0 ? "Passenger" : "Passengers"}`,
  }));

  const classOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First Class" },
  ];

  const fetchFlightSuggestions = async (query, isFromField = true) => {
    const BASE_URL = process.env.REACT_APP_FLIGHT_API_URL;
    if (!query) return;

    try {
      isFromField ? setLoadingFrom(true) : setLoadingTo(true);
      const response = await axios.get(BASE_URL, {
        params: { searchTerm: query },
      });
      console.log(response.data);
      const suggestions = response.data?.results || [];
      isFromField ? setFromOptions(suggestions) : setToOptions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      isFromField ? setLoadingFrom(false) : setLoadingTo(false);
    }
  };

  return (
    <>
      <Card sx={{ mx: "auto", mt: 4, width: "100%" }}>
        <CardHeader
          avatar={<FlightTakeoffIcon color="primary" />}
          title="Flight Search"
          subheader="Search for the best deals on flights"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Trip Type
              </Typography>
              <RadioGroup
                row
                value={formData.tripType}
                onChange={handleTripTypeChange}
                name="tripType"
              >
                <FormControlLabel
                  value="roundTrip"
                  control={<Radio />}
                  label="Round Trip"
                />
                <FormControlLabel
                  value="oneWay"
                  control={<Radio />}
                  label="One Way"
                />
              </RadioGroup>
            </FormControl>

            <div className="flex flex-col md:flex-row md:gap-4 gap-2 justify-between mb-4">
              <div className="w-full md:w-1/2">
                <Autocomplete
                  options={fromOptions}
                  loading={loadingFrom}
                  sx={{ width: "100%" }}
                  getOptionLabel={(option) =>
                    `${option.municipality} - ${option.name} (${option.iata_code})`
                  }
                  onInputChange={(event, value) => {
                    fetchFlightSuggestions(value, true);
                  }}
                  onChange={(e, value) => {
                    setFormData((prev) => ({
                      ...prev,
                      from: value ?? {},
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      fullWidth
                      error={!!errors.from}
                      helperText={errors.from}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </div>

              <div className="w-full md:w-1/2">
                <Autocomplete
                  options={toOptions}
                  loading={loadingTo}
                  getOptionLabel={(option) =>
                    `${option.municipality} - ${option.name} (${option.iata_code})`
                  }
                  onInputChange={(event, value) => {
                    fetchFlightSuggestions(value, false);
                  }}
                  onChange={(e, value) => {
                    setFormData((prev) => ({
                      ...prev,
                      to: value ?? {},
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      fullWidth
                      error={!!errors.to}
                      helperText={errors.to}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Row 1: Dates */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <TextField
                    label="Departure Date"
                    name="departureDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    error={!!errors.departureDate}
                    helperText={errors.departureDate}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <TextField
                    label="Return Date"
                    name="returnDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    disabled={formData.tripType === "oneWay"}
                    error={!!errors.returnDate}
                    helperText={errors.returnDate}
                  />
                </div>
              </div>

              {/* Row 2: Passengers and Class */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <FormControl fullWidth>
                    <InputLabel>Passengers</InputLabel>
                    <Select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleInputChange}
                      label="Passengers"
                    >
                      {passengerOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="w-full md:w-1/2">
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      label="Class"
                    >
                      {classOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search Flights"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {submittedData && (
        <Card sx={{ mx: "auto", mt: 4, width: "100%", bgcolor: "#f5f5f5" }}>
          <CardHeader title="Booking Summary" />
          <CardContent>
            <Typography variant="subtitle1">
              <strong>Trip Type:</strong>{" "}
              {submittedData.tripType === "roundTrip"
                ? "Round Trip"
                : "One Way"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>From:</strong> {submittedData.from?.municipality} (
              {submittedData.from?.iata_code})
            </Typography>
            <Typography variant="subtitle1">
              <strong>To:</strong> {submittedData.to?.municipality} (
              {submittedData.to?.iata_code})
            </Typography>
            <Typography variant="subtitle1">
              <strong>Departure Date:</strong> {submittedData.departureDate}
            </Typography>
            {submittedData.tripType === "roundTrip" && (
              <Typography variant="subtitle1">
                <strong>Return Date:</strong> {submittedData.returnDate}
              </Typography>
            )}
            <Typography variant="subtitle1">
              <strong>Passengers:</strong> {submittedData.passengers}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Class:</strong> {submittedData.class}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
