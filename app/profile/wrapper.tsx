"use client";

import saveUserProfile from "@/actions/profile";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import truncateEthAddress from "truncate-eth-address";

export interface ProfileWrapperProps {
  user: User;
}

export default function ProfileWrapper({ user }: ProfileWrapperProps) {
  const { register, handleSubmit, reset } = useForm<ProfileWrapperProps>({
    defaultValues: {
      user: {
        username: user?.username,
        bio: user?.bio,
      },
    },
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");

  const isDisabled = loading || fetching

  useEffect(() => {
    reset({
      user: {
        username: user?.username,
        bio: user?.bio,
      },
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileWrapperProps) => {
    setLoading(true);
    setMessage("");
    setErrors({});
    const formData = new FormData();
    formData.append("username", data.user?.username ?? "");
    formData.append("bio", data.user?.bio ?? "");

    const result = await saveUserProfile(formData);
    if (result.errors) {
      setErrors(result.errors);
    } else {
      setMessage("Profile updated");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setFetching(false)
    }
  }, [user])

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)]">
      <>
        <h1 className="text-2xl">Profile</h1>
        <h3 className="text-lg mb-5">
          {user.address && !fetching ? truncateEthAddress(user.address) : "Loading user..."}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <input
            {...register("user.username")}
            disabled={isDisabled}
            placeholder="Username"
            className="p-2 border bg-white rounded text-black disabled:opacity-75"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          <textarea
            {...register("user.bio")}
            disabled={isDisabled}
            placeholder="Bio"
            className="p-2 border bg-white rounded text-black disabled:opacity-75"
          />
          {errors.bio && <p className="text-red-500">{errors.bio}</p>}
          <button
            type="submit"
            disabled={isDisabled}
            className="p-2 bg-purple-500 text-white rounded disabled:opacity-75"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          {message && <p className="text-green-500">{message}</p>}
        </form>
      </>
    </div>
  );
}
