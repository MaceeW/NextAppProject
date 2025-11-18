import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

const SignInPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
};

export default SignInPage;
