import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export default function useBookings() {
  const [searchParams] = useSearchParams();

  //1.FILTER
  const statusFilterValue = searchParams.get("status");
  const filter =
    !statusFilterValue || statusFilterValue === "all"
      ? null
      : { field: "status", value: statusFilterValue, method: "eq" };

  //2.SORT
  const sortByString = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByString.split("-");
  const sortBy = { field, direction };

  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy],
    queryFn: () => getBookings(filter, sortBy),
  });

  return { isLoading, bookings, error };
}
