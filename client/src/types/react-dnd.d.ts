declare module 'react-dnd' {
    import * as React from 'react';
  
    // Types for Dragging and Dropping
    export type DragObjectWithType = any;
    export type DropTargetMonitor = any;
    export type DragSourceMonitor = any;
    export type DropTargetCollector = (monitor: DropTargetMonitor) => any;
    export type DragSourceCollector = (monitor: DragSourceMonitor) => any;
    
    // Declare useDrag and useDrop hooks
    export function useDrag<T>(spec: any, collect?: (monitor: any) => any): [any, any];
    export function useDrop<T>(spec: any, collect?: (monitor: any) => any): [any, any];
    
    // Declare the HTML5 backend
    export const HTML5Backend: any;
  
    // Declare DndProvider component
    export interface DndProviderProps {
      backend: any;
      children: React.ReactNode;
    }
  
    export class DndProvider extends React.Component<DndProviderProps> {}
  }