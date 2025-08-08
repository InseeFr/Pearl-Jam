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

declare module 'dramaQueen/useArticulationTable' {
  export function useArticulationTable(
    React,
    string
  ): {
    rows: {
      cells: { value: number }[];
      progress: 0 | -1 | 1;
      label: string;
      url: string;
    }[];
  };
}
