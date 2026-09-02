import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      toast.success("User account updated succesfully");
      // Write the fresh user straight into cache so avatar/name update immediately, without waiting on a refetch
      queryClient.setQueryData(["user"], user.user);
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateUser };
}
