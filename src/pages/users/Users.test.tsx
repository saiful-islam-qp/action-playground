import { render, screen } from "@testing-library/react";
import Users from "./Users";
import AppProvider from "@/AppProvider";

describe("Users component", () => {
  test("Users component rendered", async () => {
    render(<Users />, { wrapper: AppProvider });

    const usersElement = screen.getByText("Loading...");
    expect(usersElement).toBeInTheDocument();

    const heading = await screen.findByRole("heading");
    expect(heading).toHaveTextContent("Users");

    const tableElement = await screen.findByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  test("User component table render with proper columns", async () => {
    render(<Users />, { wrapper: AppProvider });

    const tableElement = await screen.findByRole("table");
    const tableHeaders = await screen.findAllByRole("columnheader");
    expect(tableHeaders).toHaveLength(6);
    expect(tableElement).toHaveTextContent("ID");
    expect(tableElement).toHaveTextContent("Name");
    expect(tableElement).toHaveTextContent("Username");
    expect(tableElement).toHaveTextContent("Email");
    expect(tableElement).toHaveTextContent("Phone");
    expect(tableElement).toHaveTextContent("Website");
  });
});
