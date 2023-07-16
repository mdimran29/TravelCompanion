import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Hotels.css';

const MyComponent = () => {
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [guestQty, setGuestQty] = useState('');
  const [roomQty, setRoomQty] = useState('');
  const [destId, setDestId] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (destId) {
        const options = {
          method: 'GET',
          url: 'https://apidojo-booking-v1.p.rapidapi.com/properties/list',
          params: {
            offset: '0',
            arrival_date: formatDate(arrivalDate),
            departure_date: formatDate(departureDate),
            guest_qty: 1,
            dest_ids: destId,
            room_qty: 1,
            search_type: 'city',
            search_id: 'none',
          },
          headers: {
            'X-RapidAPI-Key': '1b43b998e8mshecf18b614780362p1be75ejsne18f9cebbd57',
            'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com',
          },
        };

        try {
          const response = await axios.request(options);
          setResponseData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [destId, arrivalDate, departureDate, guestQty, roomQty]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'location') {
      setQuery(value);
    }
  };

  const handleArrivalDateChange = (date) => {
    setArrivalDate(date);
  };

  const handleDepartureDateChange = (date) => {
    setDepartureDate(date);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const options1 = {
      method: 'GET',
      url: 'https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete',
      params: { text: query },
      headers: {
        'X-RapidAPI-Key': '1b43b998e8mshecf18b614780362p1be75ejsne18f9cebbd57',
        'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options1);
      setResponseData(response.data);

      // Store dest_id separately
      const destId = response.data[0].dest_id;
      console.log('Destination ID:', destId);
      setDestId(destId);
    } catch (error) {
      console.error(error);
      setDestId('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={query}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Arrival Date:
          <DatePicker
            selected={departureDate}
            onChange={handleDepartureDateChange}
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <br />
        <label>
          Departure Date:
          <DatePicker
            selected={arrivalDate}
            onChange={handleArrivalDateChange}
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <br />
        <button type="submit">Search</button>
      </form>
      {/* {responseData && (
        <pre>{JSON.stringify(responseData, null, 2)}</pre>
      )} */}

      {responseData && responseData.result ? (
        <div>
          {responseData.result.map((hotel, index) => (
            <div key={index}>
              <h3>Hotel Name: {hotel.hotel_name}</h3>
              <p>Address: {hotel.address}</p>
              <p>Currency Code: {hotel.currencycode}</p>
              <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                <button>Book Now</button>
              </a>
              <hr/>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}


    </div>
  );
};

export default MyComponent;

