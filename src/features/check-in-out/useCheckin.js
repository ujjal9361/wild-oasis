import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkInMutate, isPending: isCheckingIn } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in.`);
      queryClient.invalidateQueries({ active: true });
      navigate("/");
    },
    onError: (err) => toast.error("Error while checking in"),
  });
  return { checkInMutate, isCheckingIn };
}
