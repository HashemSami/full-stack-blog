export const stateHook = <Type>(
  data: Type
): [getData: () => Type, setData: (newData: Type) => void] => {
  let datan = data;
  const setData = (newData: Type) => {
    datan = newData;
  };
  const getData = () => datan;
  return [getData, setData];
};

export type StateType = ReturnType<typeof stateHook>;
