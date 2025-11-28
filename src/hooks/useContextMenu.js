import { useState } from "react";

export function useContextMenu() {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setX(e.clientX);
    setY(e.clientY);
    setVisible(true);
  };

  const close = () => setVisible(false);

  return {
    visible,
    x,
    y,
    handleContextMenu,
    close,
  };
}
