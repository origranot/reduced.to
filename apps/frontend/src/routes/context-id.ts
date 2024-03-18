import { Signal, createContextId } from "@builder.io/qwik";

export const DrawerContext = createContextId<DrawerContextType>('context.isDrawerOpen');

export type DrawerContextType = {
    isDrawerOpen: Signal<boolean>;
  } 