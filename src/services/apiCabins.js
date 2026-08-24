import supabase from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return cabins;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function createOrEditCabin(newCabin, id) {
  const { image, oldImage, ...cabinData } = newCabin;
  const hasNewlyUploadedImage = typeof image !== "string";

  let uniqueImageName = "";
  if (hasNewlyUploadedImage) {
    uniqueImageName = `${Math.random()}-${image.name}`.replaceAll("/", "");
  }
  const oldImageName =
    id && oldImage
      ? decodeURIComponent(new URL(oldImage).pathname.split("/").pop())
      : null;

  if (hasNewlyUploadedImage) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(uniqueImageName, image);
    if (storageError) {
      console.error(storageError);
      throw new Error("Cabin image could not be uploaded.");
    }
  }

  const imagePath = hasNewlyUploadedImage
    ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${uniqueImageName}`
    : image;

  const { data, error } = id
    ? await supabase
        .from("cabins")
        .update({ ...cabinData, image: imagePath })
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from("cabins")
        .insert([{ ...cabinData, image: imagePath }])
        .select()
        .single();

  if (error) {
    if (hasNewlyUploadedImage) {
      await supabase.storage.from("cabin-images").remove([uniqueImageName]);
    }
    console.error(error);
    throw new Error("Cabin operation was unsuccessful.");
  }

  if (id && hasNewlyUploadedImage && oldImageName) {
    const { error: removeError } = await supabase.storage
      .from("cabin-images")
      .remove([oldImageName]);
    if (removeError) console.error(removeError);
  }

  return data;
}

export async function deleteCabin(cabin) {
  const { id, image } = cabin;
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  const imageName = decodeURIComponent(
    new URL(image).pathname.split("/").pop(),
  );
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .remove([imageName]);

  if (storageError) {
    console.error(storageError);
    throw new Error("Cabin deleted, but its image could not be deleted");
  }
}
