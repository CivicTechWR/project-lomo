import { describe, it, expect } from "vitest";
import { redactRequestDetailsText, redactRequestTitleForVolunteer } from "./redactHelpRequest";

describe("Request Redaction", () => {
  it("removes sensitive location prefixes from details", () => {
    const input = "I need help carrying groceries.\nAddress: 123 Main St\nDirections: Around back.";
    const result = redactRequestDetailsText(input);

    expect(result).toBe("I need help carrying groceries.");
    expect(result).not.toContain("Address:");
  });

  it("provides a fallback when all lines are redacted", () => {
     const input = "Location: 123 Main St\nPickup: Back door";
     const result = redactRequestDetailsText(input);

     expect(result).toBe("Location and address details are hidden until you are matched.");
  });

  it("redacts specific titles based on category", () => {
    expect(redactRequestTitleForVolunteer("ride", "Doctor appointment")).toBe("Ride request");
    expect(redactRequestTitleForVolunteer("support", "Walk — Tuesday")).toBe("Walk together");
  });
});