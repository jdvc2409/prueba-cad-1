import { describe, expect, it } from "vitest";
import { canFinishJourney, computeStatus } from "@/lib/unlock";
import type { NodeStatus } from "@/lib/types";

function progress(completed: string[]): Record<string, NodeStatus> {
  return Object.fromEntries(completed.map((id) => [id, "completed"]));
}

describe("canFinishJourney", () => {
  it("habilita la entrega con cuatro nodos en dos ramas", () => {
    expect(canFinishJourney(progress(["M0", "M1A", "E0", "E1A"]))).toBe(true);
  });

  it("no habilita la entrega si los cuatro nodos pertenecen a una sola rama", () => {
    expect(canFinishJourney(progress(["M0", "M1A", "M1B", "M2"]))).toBe(false);
  });

  it("no habilita la entrega con menos de cuatro nodos", () => {
    expect(canFinishJourney(progress(["M0", "M1A", "E0"]))).toBe(false);
  });
});

describe("reto integrador", () => {
  it("se desbloquea al completar Aplicación en dos ramas distintas", () => {
    expect(computeStatus("IR", progress(["M2", "E2"]))).toBe("available");
  });

  it("permanece bloqueado con una sola rama en Aplicación", () => {
    expect(computeStatus("IR", progress(["M2"]))).toBe("locked");
  });
});
