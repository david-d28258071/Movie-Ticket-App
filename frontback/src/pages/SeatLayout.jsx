import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const { id, date } = useParams();
  const navigate = useNavigate();

  // Fetch show details
  const getShow = () => {
    const foundShow = dummyShowsData.find(item => item._id === id);

    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData
      });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  // Handle seat click
  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast.error("Please select time first");

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5)
      return toast.error("You can select up to 5 seats");

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    );
  };

  // Proceed button validation
  const handleProceed = () => {
    if (!selectedTime) return toast.error("Please select a time");
    if (selectedSeats.length === 0) return toast.error("Select at least 1 seat");
    navigate("/MyBooking");
  };

  // Render seat rows
  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded-md border border-primary/60 cursor-pointer 
                ${isSelected ? "bg-primary text-white" : ""}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!show) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-12 md:pt-12">

      {/* Available Times */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-12">
        <p className="text-lg font-semibold px-6">Available Timing</p>

        <div className="mt-5 space-y-1">
          {show.dateTime?.[date]?.length ? (
            show.dateTime[date].map(item => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition 
                  ${
                    selectedTime?.time === item.time
                      ? "bg-primary text-white"
                      : "hover:bg-primary/20"
                  }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className="px-6 text-sm text-gray-400">No timings available</p>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-xl font-semibold mb-4">SELECT YOUR SEAT</h1>

        <img src={assets.screenImage} alt="Screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          {/* Top rows A, B */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map(row => renderSeats(row))}
          </div>

          {/* Rest rows */}
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, i) => (
              <div key={i}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>

          <button
            onClick={handleProceed}
            className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
