import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import useCabins from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading: isLoadingBookings } = useRecentBookings();
  const {
    isLoading: isLoadingStays,
    stays,
    confirmedStays,
    numberOfDays,
  } = useRecentStays();
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  if (isLoadingBookings || isLoadingStays || isLoadingCabins)
    return <Spinner />;
  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numberOfDays={numberOfDays}
        cabinCount={cabins.length}
      />
      <div>Today's Activities</div>
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numberOfDays={numberOfDays} />
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
