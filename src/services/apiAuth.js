import supabase from "./supabase";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  //1.Update the password or fullName
  let updatingData;
  if (password) updatingData = { password };
  if (fullName) updatingData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updatingData);
  if (error) throw new Error(error.message);

  if (!avatar) return data;

  // 2. Upload the avatar image
  const uniqueFileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: avatarUploadError } = await supabase.storage
    .from("avatars")
    .upload(uniqueFileName, avatar);
  if (avatarUploadError) throw new Error(avatarUploadError.message);

  // 3.Update the avatar in user's image field
  const { data: updatedUser, error: secondUpdateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${uniqueFileName}`,
      },
    });

  if (secondUpdateError) throw new Error(secondUpdateError.message);

  // 4. Delete the previous avatar image, if the user already had one
  const oldAvatarUrl = data.user.user_metadata?.avatar;
  if (oldAvatarUrl) {
    const oldAvatarName = decodeURIComponent(
      new URL(oldAvatarUrl).pathname.split("/").pop(),
    );
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([oldAvatarName]);
    if (deleteError) console.error(deleteError);
  }

  return updatedUser;
}
