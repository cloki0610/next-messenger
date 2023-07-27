"use client";

import useActiveChannel from "../_hooks/useActiveChannel";

export default function ActiveStatus() {
  useActiveChannel();
  return null;
}
