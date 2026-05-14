import { render, screen } from "@testing-library/react";
import { App } from "./App";

jest.mock("./auth/useAuth", () => ({
  useAuth: () => ({
    loading: false,
    user: null,
    getIdToken: jest.fn(),
  }),
}));

jest.mock("./health/useHealthData", () => ({
  useHealthData: () => ({
    loading: false,
    data: null,
    error: null,
  }),
}));

describe("App", () => {
  test("renderiza chamada de ingresso seguro sem mocks de API no hook real", () => {
    render(<App />);
    expect(screen.getByText("PRISMA13")).toBeInTheDocument();
    expect(screen.getByText(/Entre para sincronizar seus sinais reais/i)).toBeInTheDocument();
  });
});
