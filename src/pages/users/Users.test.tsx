import { render, screen } from "@testing-library/react";
import axios from "axios";
import Users from "./Users";
import AppProvider from "@/AppProvider";
import { IUser } from "@/models/UserModel";

jest.mock("axios");
const mockedGet = jest.mocked(axios.get);

const mockUsers: IUser[] = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
  },
];

describe("Users component", () => {
  beforeEach(() => {
    mockedGet.mockResolvedValue({ data: mockUsers });
  });

  afterEach(() => {
    mockedGet.mockReset();
  });

  test("Users component rendered", async () => {
    render(<Users />, { wrapper: AppProvider });

    const usersElement = screen.getByText("Loading...");
    expect(usersElement).toBeInTheDocument();

    const heading = await screen.findByRole("heading", { name: "Users" });
    expect(heading).toBeInTheDocument();

    const tableElement = await screen.findByRole("table");
    expect(tableElement).toBeInTheDocument();
    expect(mockedGet).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
    );
  });

  test("User component table render with proper columns", async () => {
    render(<Users />, { wrapper: AppProvider });

    const tableElement = await screen.findByRole("table");
    const tableHeaders = await screen.findAllByRole("columnheader");
    expect(tableHeaders).toHaveLength(5);
    expect(tableElement).toHaveTextContent("ID");
    expect(tableElement).toHaveTextContent("Name");
    expect(tableElement).toHaveTextContent("Username");
    expect(tableElement).toHaveTextContent("Email");
    expect(tableElement).toHaveTextContent("Phone");
    expect(tableElement).not.toHaveTextContent("Website");
  });

  test("User component renders a row per mocked user", async () => {
    render(<Users />, { wrapper: AppProvider });

    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.queryByText("hildegard.org")).not.toBeInTheDocument();
  });
});
