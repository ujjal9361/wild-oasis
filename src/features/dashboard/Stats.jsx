import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import Stat from "./Stat";
import { HiOutlineChartBar } from "react-icons/hi";
import { formatCurrency } from "../../utils/helpers";
function Stats({ bookings, confirmedStays, numberOfDays, cabinCount }) {
  // 1.Number of Bookings
  const numberOfBookings = bookings.length;
  //   2. Total sales
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);
  //   3.Check ins
  const checkins = confirmedStays.length;
  //   4.occupation
  const occupiedNights = confirmedStays.reduce(
    (acc, cur) => acc + cur.numNights,
    0,
  );
  const occupationRate = occupiedNights / (numberOfDays * cabinCount);

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numberOfBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupationRate * 100) + "%"}
      />
    </>
  );
}

export default Stats;
