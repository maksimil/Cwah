declare module "*.json" {
  const value: any;
  export default value;
}

type smap<T> = { [key: string]: T };
