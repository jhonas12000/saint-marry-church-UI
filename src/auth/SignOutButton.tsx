import React from "react";
import { signOutAndRedirect } from "../auth/storage";

const SignOutButton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <button
      onClick={signOutAndRedirect}
      className={className ?? "px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"}
      title="Sign out"
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
