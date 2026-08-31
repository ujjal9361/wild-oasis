import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export default function useBookings() {
  const queryClient = useQueryClient();
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

  const totalNumberOfPages = Math.ceil(count / PAGE_SIZE);
  //PRE_FETCHING
  if (currentPage < totalNumberOfPages) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, currentPage + 1],
      queryFn: () => getBookings(filter, sortBy, currentPage + 1),
    });
  }
  if (currentPage > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, currentPage - 1],
      queryFn: () => getBookings(filter, sortBy, currentPage - 1),
    });
  }

  return { isLoading, bookings, error, count };
}
