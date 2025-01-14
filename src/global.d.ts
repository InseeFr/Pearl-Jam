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
  }): () => void;
}
