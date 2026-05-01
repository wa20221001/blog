import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

// Test component that uses the theme context
function TestComponent() {
  const { theme, actualTheme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="actual-theme">{actualTheme}</span>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render children without crashing", () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should initialize with system theme by default", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
    }, { timeout: 3000 });
  });

  it("should load theme from localStorage on mount", async () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    }, { timeout: 3000 });
  });

  it("should change theme when setTheme is called", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
    }, { timeout: 3000 });

    await user.click(screen.getByText("Light"));

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
      expect(localStorage.getItem("theme")).toBe("light");
    }, { timeout: 3000 });
  });

  it("should add dark class to html element when theme is dark", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.click(screen.getByText("Dark"));

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    }, { timeout: 3000 });
  });

  it("should remove dark class from html element when theme is light", async () => {
    const user = userEvent.setup();

    // First set to dark
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    }, { timeout: 3000 });

    // Then switch to light
    await user.click(screen.getByText("Light"));

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    }, { timeout: 3000 });
  });
});
