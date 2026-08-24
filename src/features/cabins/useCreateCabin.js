import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOrEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabinMutate, isPending: isCreating } = useMutation({
    mutationFn: createOrEditCabin,
    onSuccess: () => {
      toast.success("New Cabin created succesfully");
      queryClient.invalidateQueries({
        queryKey: "cabins",
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCabinMutate };
}
