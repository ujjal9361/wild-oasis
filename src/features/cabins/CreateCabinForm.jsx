import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { createOrEditCabin } from "../../services/apiCabins";

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate: createCabinMutate, isPending: isCreating } = useMutation({
    mutationFn: createOrEditCabin,
    onSuccess: () => {
      toast.success("New Cabin created succesfully");
      queryClient.invalidateQueries({
        queryKey: "cabins",
      });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });
  const { mutate: editCabinMutate, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createOrEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("New Cabin edited succesfully");
      queryClient.invalidateQueries({
        queryKey: "cabins",
      });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const isLoading = isCreating || isEditing;

  function onSubmit(formData) {
    const image =
      typeof formData.image === "string" ? formData.image : formData.image[0];
    if (isEditSession) {
      editCabinMutate({
        newCabinData: { ...formData, image, oldImage: editValues.image },
        id: editId,
      });
    } else {
      createCabinMutate({ ...formData, image: formData.image[0] });
    }
  }
  function onError(errors) {
    // console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
            min: {
              value: 1,
              required: "Capacity should be at least 1.",
            },
          })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required.",
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            min: {
              value: 0,
              message: "Discount cannot be a negative value.",
            },
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should not exceed the price",
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin Photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isLoading}>
          {isEditSession ? "Edit Cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
