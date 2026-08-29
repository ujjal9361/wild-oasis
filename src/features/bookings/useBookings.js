import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export default function useBookings() {
  const [searchParams] = useSearchParams();
  const statusFilterValue = searchParams.get("status");
  const filter =
    !statusFilterValue || statusFilterValue === "all"
      ? null
      : { field: "status", value: statusFilterValue, method: "eq" };
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter],
    queryFn: () => getBookings(filter),
  });

  return { isLoading, bookings, error };
}
