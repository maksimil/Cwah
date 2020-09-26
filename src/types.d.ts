type HookSetter<T> = React.Dispatch<React.SetStateAction<T>>;

type Page = React.FC<{
  socket: SocketIOClient.Socket;
  setpath: HookSetter<string>;
}>;
