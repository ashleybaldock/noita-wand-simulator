import { isString } from '../../util';

export const breakpoints = ['500px', '600px', '700px'] as const;

export const isBreakpoint = (
  (breakpointSet) =>
  (x: unknown): x is BreakPoint =>
    isString(x) && (breakpointSet as Set<string>).has(x)
)(new Set(breakpoints));
export type BreakPoint = (typeof breakpoints)[number];
/*
 *

--pad-other-side: 2.7em;
padding-left: 0.6em;
background-position: 100% 50%;
--background-size: 0.46em;
--pad-img-side: calc(var(--background-size) + 1.9em);

 */
