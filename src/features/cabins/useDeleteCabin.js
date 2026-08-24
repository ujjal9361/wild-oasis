import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin } from "../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: deleteCabinMutate } = useMutation({
    mutationFn: deleteCabin,
    onSuccess: () => {
      toast.success("Cabin deleted succesfully");
      queryClient.invalidateQueries({
        queryKey: "cabins",
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabinMutate };
}
