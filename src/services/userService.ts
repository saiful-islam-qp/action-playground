import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { IUser } from "@/models/UserModel";

const fetchUsers = async () => {
  const response: AxiosResponse<IUser[]> = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  const data = response.data;
  return data;
};

export const useFetchUsers = (): UseQueryResult<IUser[], AxiosError> => {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
};
