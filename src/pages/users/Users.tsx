import { useMemo } from "react";
import { useFetchUsers } from "@/services/userService";
import { IUser } from "@/models/UserModel";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "@/components/buttons/table/Table";

const Users = () => {
  const { data: userData, isPending, isError, error } = useFetchUsers();

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
    ],
    [],
  );

  const defaultData = useMemo(() => [] as IUser[], []);
  const table = useReactTable<IUser>({
    data: userData || defaultData,
    columns,
    rowCount: userData?.length || 0,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <Table table={table} />
    </div>
  );
};

export default Users;
