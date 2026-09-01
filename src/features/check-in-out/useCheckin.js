import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckin() {
  const queryClient = useQueryClient();
  const { mutate: checkInMutate, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in.`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: (err) => toast.error("Error while checking in"),
  });
  return { checkInMutate, isCheckingIn };
}
