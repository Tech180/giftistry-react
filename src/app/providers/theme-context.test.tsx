import React from "react";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-context";
import { AuthContext } from "app/providers/auth-context";

jest.mock("app/providers/auth-context", () => {
  const React = require("react");
  const mockAuthContext = React.createContext({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
  return {
    AuthContext: mockAuthContext,
    useAuth: () => React.useContext(mockAuthContext),
  };
});

// Helper component to consume theme and trigger changes
function ThemeConsumer() {
  const { theme, appearance, setTheme, setAppearance, toggleAppearance } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="appearance">{appearance}</span>
      <button data-testid="set-cyberpunk" onClick={() => setTheme("cyberpunk")}>Set Cyberpunk</button>
      <button data-testid="set-dark" onClick={() => setAppearance("dark")}>Set Dark</button>
      <button data-testid="toggle-app" onClick={toggleAppearance}>Toggle</button>
    </div>
  );
}

// Helper to consume holiday locking values
function HolidayConsumer() {
  const { unlockedThemes, isThemeUnlocked } = useTheme();
  return (
    <div>
      <span data-testid="unlocked-themes">{JSON.stringify(unlockedThemes)}</span>
      <span data-testid="is-halloween-unlocked">{String(isThemeUnlocked("halloween"))}</span>
      <span data-testid="is-christmas-unlocked">{String(isThemeUnlocked("christmas"))}</span>
      <span data-testid="is-valentines-unlocked">{String(isThemeUnlocked("valentines"))}</span>
      <span data-testid="is-st-patricks-unlocked">{String(isThemeUnlocked("st-patricks"))}</span>
      <span data-testid="is-earth-day-unlocked">{String(isThemeUnlocked("earth-day"))}</span>
      <span data-testid="is-independence-unlocked">{String(isThemeUnlocked("independence"))}</span>
      <span data-testid="is-thanksgiving-unlocked">{String(isThemeUnlocked("thanksgiving"))}</span>
    </div>
  );
}

describe("ThemeProvider and useTheme", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  beforeEach(() => {
    localStorage.clear();
    // Clean up any link elements created during test runs
    const links = document.querySelectorAll('link[id="theme-stylesheet"], link[data-theme-style="pending"]');
    links.forEach(l => l.parentNode?.removeChild(l));
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-appearance");
    jest.useRealTimers();
  });

  test("initializes with default values and writes attributes to documentElement", () => {
    render(
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false } as any}>
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("default");
    expect(screen.getByTestId("appearance").textContent).toBe("system");

    expect(document.documentElement.getAttribute("data-theme")).toBe("default");
    expect(document.documentElement.getAttribute("data-appearance")).toBeDefined();

    // Verify dynamic link element was appended
    const link = document.getElementById("theme-stylesheet") as HTMLLinkElement;
    expect(link).toBeDefined();
    expect(link?.rel).toBe("stylesheet");
    expect(link?.href).toContain("/api/themes/default/");
  });

  test("loads saved preferences from localStorage", () => {
    localStorage.setItem("giftistry-theme", "neon");
    localStorage.setItem("giftistry-appearance", "dark");

    render(
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false } as any}>
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("neon");
    expect(screen.getByTestId("appearance").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("neon");
    expect(document.documentElement.getAttribute("data-appearance")).toBe("dark");

    const link = document.getElementById("theme-stylesheet") as HTMLLinkElement;
    expect(link?.href).toContain("/api/themes/neon/dark/css");
  });

  test("updates theme, writes to localStorage, and updates document attributes", () => {
    render(
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false } as any}>
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </AuthContext.Provider>
    );

    const button = screen.getByTestId("set-cyberpunk");
    act(() => {
      button.click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("cyberpunk");
    expect(localStorage.getItem("giftistry-theme")).toBe("cyberpunk");
    expect(document.documentElement.getAttribute("data-theme")).toBe("cyberpunk");
  });

  describe("Holiday Theme Access Control", () => {
    test("locks holiday themes by default for anonymous users or outside holiday periods", () => {
      // Current date is June 15, 2026 (non-holiday)
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 5, 15));

      render(
        <AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false } as any}>
          <ThemeProvider>
            <HolidayConsumer />
          </ThemeProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId("is-halloween-unlocked").textContent).toBe("false");
      expect(screen.getByTestId("is-christmas-unlocked").textContent).toBe("false");
    });

    test("unlocks Halloween when active in October and user has registered before/during October", () => {
      // Current date is October 10, 2026 (currentMonth = 9)
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 9, 10));

      const mockUser = {
        Id: "user-123",
        CreatedAt: new Date(2026, 9, 5).toISOString(), // Registered Oct 5, 2026
        Name: "Test User",
        Email: "test@test.com",
      };

      render(
        <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
          <ThemeProvider>
            <HolidayConsumer />
          </ThemeProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId("is-halloween-unlocked").textContent).toBe("true");
      expect(screen.getByTestId("is-christmas-unlocked").textContent).toBe("false");

      // Verify unlocking persists in localStorage
      const savedUnlocked = JSON.parse(localStorage.getItem("giftistry-unlocked-themes") || "[]");
      expect(savedUnlocked).toContain("halloween");
    });

    test("unlocks Christmas when active in December and user has registered before/during December", () => {
      // Current date is December 25, 2026 (currentMonth = 11)
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 11, 25));

      const mockUser = {
        Id: "user-123",
        CreatedAt: new Date(2026, 11, 20).toISOString(), // Registered Dec 20, 2026
        Name: "Test User",
        Email: "test@test.com",
      };

      render(
        <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
          <ThemeProvider>
            <HolidayConsumer />
          </ThemeProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId("is-halloween-unlocked").textContent).toBe("false");
      expect(screen.getByTestId("is-christmas-unlocked").textContent).toBe("true");

      const savedUnlocked = JSON.parse(localStorage.getItem("giftistry-unlocked-themes") || "[]");
      expect(savedUnlocked).toContain("christmas");
    });

    test("does not unlock Halloween if active in October but user registered in November (future)", () => {
      // Current date is October 10, 2026
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 9, 10));

      const mockUser = {
        Id: "user-123",
        CreatedAt: new Date(2026, 10, 5).toISOString(), // Registered Nov 5, 2026 (invalid future date for Oct 2026)
        Name: "Test User",
        Email: "test@test.com",
      };

      render(
        <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
          <ThemeProvider>
            <HolidayConsumer />
          </ThemeProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId("is-halloween-unlocked").textContent).toBe("false");
    });

    test("remains forever unlocked once stored in localStorage even outside holiday periods", () => {
      // Pre-seed localStorage with halloween unlocked
      localStorage.setItem(
        "giftistry-unlocked-themes",
        JSON.stringify(["default", "neon", "cyberpunk", "mystic", "burnt-forest", "halloween"])
      );

      // Current date is June 15, 2026
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 5, 15));

      render(
        <AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false } as any}>
          <ThemeProvider>
            <HolidayConsumer />
          </ThemeProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByTestId("is-halloween-unlocked").textContent).toBe("true");
      expect(screen.getByTestId("is-christmas-unlocked").textContent).toBe("false");
    });

    test("unlocks Valentines in Feb, St Patricks in Mar, Earth Day in Apr, Independence in Jul, Thanksgiving in Nov", () => {
      // 1. Valentines (February -> month 1)
      {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2026, 1, 14));
        const mockUser = {
          Id: "user-123",
          CreatedAt: new Date(2026, 1, 10).toISOString(),
        };
        const { unmount } = render(
          <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
            <ThemeProvider>
              <HolidayConsumer />
            </ThemeProvider>
          </AuthContext.Provider>
        );
        expect(screen.getByTestId("is-valentines-unlocked").textContent).toBe("true");
        unmount();
      }

      localStorage.clear();

      // 2. St Patrick's (March -> month 2)
      {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2026, 2, 17));
        const mockUser = {
          Id: "user-123",
          CreatedAt: new Date(2026, 2, 5).toISOString(),
        };
        const { unmount } = render(
          <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
            <ThemeProvider>
              <HolidayConsumer />
            </ThemeProvider>
          </AuthContext.Provider>
        );
        expect(screen.getByTestId("is-st-patricks-unlocked").textContent).toBe("true");
        unmount();
      }

      localStorage.clear();

      // 3. Earth Day (April -> month 3)
      {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2026, 3, 22));
        const mockUser = {
          Id: "user-123",
          CreatedAt: new Date(2026, 3, 20).toISOString(),
        };
        const { unmount } = render(
          <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
            <ThemeProvider>
              <HolidayConsumer />
            </ThemeProvider>
          </AuthContext.Provider>
        );
        expect(screen.getByTestId("is-earth-day-unlocked").textContent).toBe("true");
        unmount();
      }

      localStorage.clear();

      // 4. Independence (July -> month 6)
      {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2026, 6, 4));
        const mockUser = {
          Id: "user-123",
          CreatedAt: new Date(2026, 6, 2).toISOString(),
        };
        const { unmount } = render(
          <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
            <ThemeProvider>
              <HolidayConsumer />
            </ThemeProvider>
          </AuthContext.Provider>
        );
        expect(screen.getByTestId("is-independence-unlocked").textContent).toBe("true");
        unmount();
      }

      localStorage.clear();

      // 5. Thanksgiving (November -> month 10)
      {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2026, 10, 26));
        const mockUser = {
          Id: "user-123",
          CreatedAt: new Date(2026, 10, 15).toISOString(),
        };
        const { unmount } = render(
          <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, isLoading: false } as any}>
            <ThemeProvider>
              <HolidayConsumer />
            </ThemeProvider>
          </AuthContext.Provider>
        );
        expect(screen.getByTestId("is-thanksgiving-unlocked").textContent).toBe("true");
        unmount();
      }
    });
  });
});
