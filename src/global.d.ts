declare module '*.jsx' {
  var _: () => any;
  export default _;
}

declare module '*.js' {
  var _: () => any;
  export default _;
}

declare module 'dramaQueen/DramaIndex' {
  export function mount(configuration: {
    mountPoint: HTMLElement | null;
    initialPathname: string;
  }): VoidFunction;
}

declare module 'dramaQueen/getArticulationTable' {
  export function getArticulationTable(interrogationId: string): Promise<{
    state: 'INIT' | 'COMPLETED' | 'VALIDATED';
    date: number;
    dates: number[];
    rows: {
      cells: { value: number }[];
      progress: 0 | -1 | 1;
      label: string;
      url: string;
    }[];
  } | null>;
}

declare module 'dramaQueen/partialResetInterrogation' {
  export function partialResetInterrogation(interrogationId: string): Promise<void>;
}
