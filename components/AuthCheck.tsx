import Link from "next/link";
import { PropsWithChildren, ReactPropTypes, useContext } from "react";
import { UserContext } from "../lib/context";

function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
}

export default AuthCheck;
