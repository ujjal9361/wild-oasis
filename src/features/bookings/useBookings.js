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

  //3.PAGINATION
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, currentPage],
    queryFn: () => getBookings(filter, sortBy, currentPage),
  });

  return { isLoading, bookings, error, count };
}
