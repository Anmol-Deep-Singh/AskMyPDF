import { useState } from "react"
import AuthCard from "../components/AuthCard"
import ButtonComp from "../components/ButtonComp"

const Auth = () => {
  const [Auth, SetAuth] = useState<"SignIn" | "SignUp">("SignUp")

  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center items-center bg-transparent">
        <div
          className="
            relative overflow-hidden 
            w-[400px] md:w-[768px] 
            min-h-[480px] 
            rounded-[30px] 
            shadow-[0_5px_15px_rgba(0,0,0,0.35)] 
            flex flex-row 
            bg-[var(--card)]
          "
        >
          <div className="hidden md:flex h-full w-1/2 rounded-[0px_150px_100px_0px] flex-col justify-center items-center bg-[var(--sidecard)] text-[rgb(var(--purple_white))]">
            <h1 className="text-4xl text-center mb-5">Welcome back</h1>
            <p className="mb-5">This is Your Auth System for the Application</p>
            <ButtonComp
              kind="B"
              color={"bg-transparent"}
              height={"h-[32px]"} 
              width={"w-[110px]"}        
              bordercolor={"border-[rgb(var(--purple_white))]"}
              text={Auth === "SignUp" ? "Sign In" : "Sign Up"}
              onClick={Auth === "SignUp" ? () => SetAuth("SignIn") : () => SetAuth("SignUp")}
            />
          </div>
          <AuthCard Auth={Auth} SetAuth={SetAuth} />

        </div>
      </div>
    </>
  )
}

export default Auth
