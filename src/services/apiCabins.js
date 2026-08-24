import supabase from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return cabins;
}

export async function createCabin(newCabin) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const uniqueImageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${uniqueImageName}`;
  //1.Create Cabin
  const { data: createdCabin, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  //2.Upload Image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(uniqueImageName, newCabin.image);

  //3.Delete the cabin if error occurs during upload of the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", createdCabin.id);
    console.error(storageError);
    throw new Error(
      "Cabin Image could not be uploaded hence cabin not created.",
    );
  }

  return createdCabin;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
}
