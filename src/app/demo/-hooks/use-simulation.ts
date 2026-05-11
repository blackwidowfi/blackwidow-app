import { useCallback, useEffect, useRef, useState } from "react";

import {
  ALLOCATION_STEPS,
  SIMULATION_PHASES,
  type AllocationStep,
  type SimulationPhase,
} from "../-utils/entities";
import { MOCK_POSITIONS } from "../-utils/positions";

export type Allocations = Record<string, number>;

interface SimulationState {
  phase: SimulationPhase;
  allocationStep: AllocationStep;
  riskTargetProtocol: string | null;
  allocations: Allocations;
}

function defaultAllocations(): Allocations {
  return Object.fromEntries(MOCK_POSITIONS.map((p) => [p.protocol, parseInt(p.allocation)]));
}

function reshuffleAllocations(excludeProtocol: string): Allocations {
  const others = MOCK_POSITIONS.map((p) => p.protocol).filter((p) => p !== excludeProtocol);
  const freed = Math.floor(Math.random() * 15) + 5;
  const split = Math.floor(Math.random() * (freed - 2)) + 1;
  const prev = defaultAllocations();
  return {
    ...prev,
    [excludeProtocol]: Math.max(0, prev[excludeProtocol] - freed),
    [others[0]]: prev[others[0]] + split,
    [others[1]]: prev[others[1]] + (freed - split),
  };
}

const INITIAL_STATE: SimulationState = {
  phase: SIMULATION_PHASES.IDLE,
  allocationStep: ALLOCATION_STEPS.SCANNING,
  riskTargetProtocol: null,
  allocations: defaultAllocations(),
};

const ALLOCATION_STEP_MS = 1500;
const RISK_DELAY_MS = 5000;
const RISK_DETECTED_MS = 2000;
const REALLOCATING_MS = 2000;

function pickRandomProtocol(): string {
  const idx = Math.floor(Math.random() * MOCK_POSITIONS.length);
  return MOCK_POSITIONS[idx].protocol;
}

export function useSimulation(connected: boolean) {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutIds.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    for (const id of timeoutIds.current) clearTimeout(id);
    timeoutIds.current = [];
  }, []);

  const scheduleRiskCycle = useCallback(() => {
    schedule(() => {
      const target = pickRandomProtocol();
      setState((s) => ({
        ...s,
        phase: SIMULATION_PHASES.RISK_DETECTED,
        riskTargetProtocol: target,
      }));

      schedule(() => {
        setState((s) => ({ ...s, phase: SIMULATION_PHASES.REALLOCATING }));

        schedule(() => {
          setState((s) => ({
            ...s,
            phase: SIMULATION_PHASES.MONITORING,
            riskTargetProtocol: null,
            allocations: s.riskTargetProtocol
              ? reshuffleAllocations(s.riskTargetProtocol)
              : s.allocations,
          }));
          scheduleRiskCycle();
        }, REALLOCATING_MS);
      }, RISK_DETECTED_MS);
    }, RISK_DELAY_MS);
  }, [schedule]);

  const deploy = useCallback(() => {
    if (!connected || state.phase === SIMULATION_PHASES.ALLOCATING) return;

    clearAll();
    setState((s) => ({
      ...s,
      phase: SIMULATION_PHASES.ALLOCATING,
      allocationStep: ALLOCATION_STEPS.SCANNING,
      riskTargetProtocol: null,
    }));

    schedule(
      () => setState((s) => ({ ...s, allocationStep: ALLOCATION_STEPS.OPTIMIZING })),
      ALLOCATION_STEP_MS,
    );
    schedule(
      () => setState((s) => ({ ...s, allocationStep: ALLOCATION_STEPS.DEPLOYING })),
      ALLOCATION_STEP_MS * 2,
    );
    schedule(() => {
      setState((s) => ({
        ...s,
        phase: SIMULATION_PHASES.MONITORING,
        allocationStep: ALLOCATION_STEPS.SCANNING,
        riskTargetProtocol: null,
      }));
      scheduleRiskCycle();
    }, ALLOCATION_STEP_MS * 3);
  }, [connected, state.phase, schedule, scheduleRiskCycle]);

  const reset = useCallback(() => {
    clearAll();
    setState(INITIAL_STATE);
  }, [clearAll]);

  useEffect(() => {
    if (!connected) reset();
  }, [connected, reset]);

  useEffect(() => () => clearAll(), [clearAll]);

  return {
    state,
    canDeploy: connected && state.phase !== SIMULATION_PHASES.ALLOCATING,
    deploy,
    reset,
    allocations: state.allocations,
  };
}
